import { config } from 'dotenv';
import { Logger, ILogObj } from 'tslog';

config();

export interface Config {
    twitter: {
        bearerToken: string;
        userToMonitor: string;
    };
    telegram: {
        botToken: string;
        chatId: string;
    };
    discord: {
        botToken: string;
        channelId: string;
    };
    api: {
        interval: number;
    };
}

export function validateConfig(logger: Logger<ILogObj>): Config {
    const requiredEnvVars = [
        'TWITTER_BEARER_TOKEN',
        'TELEGRAM_BOT_TOKEN',
        'TELEGRAM_CHAT_ID',
        'DISCORD_BOT_TOKEN',
        'DISCORD_CHANNEL_ID',
        'USER_TO_MONITOR'
    ];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }

    return {
        twitter: {
            bearerToken: process.env.TWITTER_BEARER_TOKEN!,
            userToMonitor: process.env.USER_TO_MONITOR!
        },
        telegram: {
            botToken: process.env.TELEGRAM_BOT_TOKEN!,
            chatId: process.env.TELEGRAM_CHAT_ID!
        },
        discord: {
            botToken: process.env.DISCORD_BOT_TOKEN!,
            channelId: process.env.DISCORD_CHANNEL_ID!
        },
        api: {
            interval: 16 * 60 * 1000 // 16 minutes in milliseconds
        }
    };
} 