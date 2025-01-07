import { validateConfig } from './config/config';
import { logger, logWithEmoji } from './utils/logger';
import { showProgress } from './utils/progress';
import { TwitterService } from './services/twitter';
import { TelegramService } from './services/telegram';
import { DiscordService } from './services/discord';
import { InstagramService } from './services/instagram';
import dayjs from 'dayjs';
import { Client } from 'twitter-api-sdk';
import { Config } from './config/config';

type TwitterResponse = Awaited<ReturnType<Client['tweets']['usersIdTweets']>>;
type Tweet = NonNullable<TwitterResponse['data']>[0];
type Media = NonNullable<NonNullable<TwitterResponse['includes']>['media']>[0];

async function sendToAllPlatforms(
    message: string, 
    services: Awaited<ReturnType<typeof initializeServices>>
) {
    const promises = [];
    if (services.telegram) promises.push(services.telegram.sendMessage(message));
    if (services.discord) promises.push(services.discord.sendMessage(message));
    await Promise.all(promises);
}

async function handleImageTweet(
    tweet: Tweet,
    media: Media[],
    instagramService: InstagramService | null
) {
    if (!instagramService) return;
    const tweetMedia = media.filter(
        media => media.type === 'photo' && 
        tweet.attachments?.media_keys?.includes(media.media_key ?? '')
    );

    if (tweetMedia.length > 0 && 'url' in tweetMedia[0]) {
        try {
            const imageUrl = tweetMedia[0].url as string;
            const caption = `${tweet.text ?? ''}`;
            
            await instagramService.postToInstagram(imageUrl, caption);
            logWithEmoji("Tweet with image synced to Instagram", "📸");
        } catch (error: unknown) {
            if ((error as any).response?.status === 429) {
                logWithEmoji("Instagram rate limit reached, will retry in next cycle", "⏳");
            } else {
                logger.error("Error posting to Instagram:", error);
            }
        }
    }
}

async function processTweet(
    tweet: Tweet,
    response: TwitterResponse,
    config: Config,
    services: Awaited<ReturnType<typeof initializeServices>>
) {
    const tweetUrl = `https://x.com/${config.twitter.userToMonitor}/status/${tweet.id}`;
    const message = `${tweetUrl}`;
    
    await sendToAllPlatforms(message, services);

    if (response.includes?.media) {
        await handleImageTweet(tweet,response.includes.media, services.instagram);
    }

    return tweet.id;
}

async function initializeServices(config: Config) {
    const services = {
        twitter: null as TwitterService | null,
        telegram: null as TelegramService | null,
        discord: null as DiscordService | null,
        instagram: null as InstagramService | null
    };

    // Twitter 服务是必需的
    if (!config.twitter.bearerToken) {
        throw new Error('Twitter bearer token is required');
    }
    services.twitter = new TwitterService(config.twitter.bearerToken, logger);

    // Telegram 服务
    if (config.telegram.botToken && config.telegram.chatId) {
        services.telegram = new TelegramService(config.telegram.botToken, config.telegram.chatId, logger);
    } else {
        logWithEmoji('Telegram service not configured, skipping initialization', '⚠️');
    }

    // Discord 服务
    if (config.discord.botToken && config.discord.channelId) {
        services.discord = new DiscordService(config.discord.botToken, config.discord.channelId, logger);
    } else {
        logWithEmoji('Discord service not configured, skipping initialization', '⚠️');
    }

    // Instagram 服务
    if (
        config.instagram.accessToken && 
        config.instagram.businessAccountId &&
        config.instagram.appId &&
        config.instagram.appSecret
    ) {
        services.instagram = new InstagramService(
            config.instagram.accessToken, 
            config.instagram.businessAccountId, 
            logger
        );
    } else {
        logWithEmoji('Instagram service not configured, skipping initialization', '⚠️');
    }

    // 初始化已配置的服务
    const initPromises = Object.values(services)
        .filter(service => service !== null)
        .map(service => service!.init());
    
    await Promise.all(initPromises);

    return services;
}

let instagramService: InstagramService | null = null;

process.on('SIGINT', async () => {
    logger.info('Shutting down...');
    if (instagramService) {
        await instagramService.cleanup();
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down...');
    if (instagramService) {
        await instagramService.cleanup();
    }
    process.exit(0);
});

async function main() {
    // 加载和验证配置
    const config = validateConfig(logger);
    
    // 按需初始化服务
    const services = await initializeServices(config);
    instagramService = services.instagram;  // 保存引用
    
    // 获取要监控的用户 ID
    const userId = await services.twitter!.getUserId(config.twitter.userToMonitor);
    logWithEmoji(`Fetched user ID: ${userId}`, "🆔");

    // 初始化监控参数
    let lastTweetId: string | null = null;
    const startTime = new Date().toISOString();
    logWithEmoji("Starting to monitor tweets from: " + startTime, "🔍");

    // 主循环
    while (true) {
        try {
            const response = await services.twitter!.getTweets(userId, lastTweetId, startTime);
            
            if (response.data && response.data.length > 0) {
                for (const tweet of response.data.reverse()) {
                    lastTweetId = await processTweet(
                        tweet,
                        response,
                        config,
                        services
                    );
                }
                logWithEmoji("New tweets found and processed", "✅");
            } else {
                logWithEmoji("No new tweets found", "❌");
            }

            logWithEmoji(`Waiting for next fetch cycle (${config.api.interval / 60000} minutes)`, "⏳");
            await showProgress(config.api.interval, "Waiting for next cycle");
            
        } catch (e) {
            if ((e as any).status === 429 || (e as any).code === 429) {
                const resetTime = parseInt((e as any).response?.headers?.['x-rate-limit-reset'] || 
                (e as any).headers?.['x-rate-limit-reset'] || '0') * 1000;
                const timeUntilReset = resetTime - Date.now();
                const waitTime = timeUntilReset <= 0 ? config.api.interval : timeUntilReset;
                
                logWithEmoji(`resetTime: ${dayjs(resetTime).format('YYYY-MM-DD HH:mm:ss')}`, "🕒");
                logWithEmoji(`Rate limit exceeded. Waiting ${Math.ceil(waitTime/1000)} seconds...`, "⏳");
                
                await showProgress(waitTime, "Rate limit cooldown");
            } else {
                logger.error('Error in main loop:', e);
                await showProgress(config.api.interval, "Error recovery wait");
            }
        }
    }
}

main().catch(e => logger.error('Fatal error:', e));
