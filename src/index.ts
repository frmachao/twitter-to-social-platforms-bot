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

async function sendToAllPlatforms(message: string, telegramService: TelegramService, discordService: DiscordService) {
    await Promise.all([
        telegramService.sendMessage(message),
        discordService.sendMessage(message)
    ]);
}

async function handleImageTweet(
    tweet: Tweet, 
    tweetUrl: string, 
    media: Media[], 
    instagramService: InstagramService
) {
    const tweetMedia = media.filter(
        media => media.type === 'photo' && 
        tweet.attachments?.media_keys?.includes(media.media_key ?? '')
    );

    if (tweetMedia.length > 0 && 'url' in tweetMedia[0]) {
        try {
            const imageUrl = tweetMedia[0].url as string;
            const caption = `${tweet.text ?? ''}\n\nOriginally posted on Twitter: ${tweetUrl}`;
            
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
    telegramService: TelegramService,
    discordService: DiscordService,
    instagramService: InstagramService
) {
    const tweetUrl = `https://x.com/${config.twitter.userToMonitor}/status/${tweet.id}`;
    
    // 发送到 Telegram 和 Discord
    const message = `${tweetUrl}`;
    await sendToAllPlatforms(message, telegramService, discordService);

    // 检查并处理带图片的推文
    if (response.includes?.media) {
        await handleImageTweet(tweet, tweetUrl, response.includes.media, instagramService);
    }

    return tweet.id;
}

async function main() {
    // 加载和验证配置
    const config = validateConfig(logger);
    
    // 初始化服务
    const twitterService = new TwitterService(config.twitter.bearerToken, logger);
    const telegramService = new TelegramService(config.telegram.botToken, config.telegram.chatId, logger);
    const discordService = new DiscordService(config.discord.botToken, config.discord.channelId, logger);
    const instagramService = new InstagramService(config.instagram.accessToken, config.instagram.businessAccountId, logger);

    // 初始化所有服务
    await Promise.all([
        twitterService.init(),
        telegramService.init(),
        discordService.init(),
        instagramService.init()
    ]);

    // 获取要监控的用户 ID
    const userId = await twitterService.getUserId(config.twitter.userToMonitor);
    logWithEmoji(`Fetched user ID: ${userId}`, "🆔");


    // 初始化监控参数
    let lastTweetId: string | null = null;
    const startTime = new Date().toISOString();
    logWithEmoji("Starting to monitor tweets from: " + startTime, "🔍");

    // 主循环
    while (true) {
        try {
            const response = await twitterService.getTweets(userId, lastTweetId, startTime);
            
            if (response.data && response.data.length > 0) {
                for (const tweet of response.data.reverse()) {
                    lastTweetId = await processTweet(
                        tweet,
                        response,
                        config,
                        telegramService,
                        discordService,
                        instagramService
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

    // 在 main 函数中添加错误处理和清理
    process.on('SIGINT', async () => {
        logger.info('Shutting down...');
        await instagramService.cleanup();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        logger.info('Shutting down...');
        await instagramService.cleanup();
        process.exit(0);
    });
}

main().catch(e => logger.error('Fatal error:', e));
