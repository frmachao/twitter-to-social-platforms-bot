import { validateConfig } from './config/config';
import { logger, logWithEmoji } from './utils/logger';
import { showProgress } from './utils/progress';
import { TwitterService } from './services/twitter';
import { TelegramService } from './services/telegram';
import { DiscordService } from './services/discord';
import dayjs from 'dayjs';

async function sendToAllPlatforms(message: string, telegramService: TelegramService, discordService: DiscordService) {
    await Promise.all([
        telegramService.sendMessage(message),
        discordService.sendMessage(message)
    ]);
}

async function main() {
    // 加载和验证配置
    const config = validateConfig(logger);
    
    // 初始化服务
    const twitterService = new TwitterService(config.twitter.bearerToken, logger);
    const telegramService = new TelegramService(config.telegram.botToken, config.telegram.chatId, logger);
    const discordService = new DiscordService(config.discord.botToken, config.discord.channelId, logger);

    // 初始化所有服务
    await Promise.all([
        twitterService.init(),
        telegramService.init(),
        discordService.init()
    ]);

    // 获取要监控的用户 ID
    const userId = await twitterService.getUserId(config.twitter.userToMonitor);
    logWithEmoji("Fetched user ID", "🆔");

    // 发送启动消息
    const startupMessage = `ShieldLayer Twitter Bot Test Message:  https://x.com/${config.twitter.userToMonitor}`;
    await sendToAllPlatforms(startupMessage, telegramService, discordService);

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
                    const tweetUrl = `https://x.com/${config.twitter.userToMonitor}/status/${tweet.id}`;
                    const message = `New tweet posted by @${config.twitter.userToMonitor}:\n\n${tweetUrl}`;
                    await sendToAllPlatforms(message, telegramService, discordService);
                    lastTweetId = tweet.id;
                }
                logWithEmoji("New tweets found and processed", "✅");
            } else {
                logWithEmoji("No new tweets found", "❌");
            }

            logWithEmoji(`Waiting for next fetch cycle (${config.api.interval / 60000} minutes)`, "⏳");
            await showProgress(config.api.interval, "Waiting for next cycle");
            
        } catch (e) {
            if ((e as any).status === 429 || (e as any).code === 429) {
                const resetTime = parseInt((e as any).response?.headers?.['x-rate-limit-reset'] || '0') * 1000;
                const timeUntilReset = resetTime - Date.now();
                const waitTime = timeUntilReset <= 0 ? config.api.interval : timeUntilReset;
                
                const formattedResetTime = dayjs(resetTime).format('YYYY-MM-DD HH:mm:ss');
                logWithEmoji(`Rate limit reset time: ${formattedResetTime}`, "🕒");
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
