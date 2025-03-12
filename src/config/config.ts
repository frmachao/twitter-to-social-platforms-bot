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
    instagram: {
        accessToken: string | null;
        businessAccountId: string | null;
        appId: string | null;
        appSecret: string | null;
    };
    reddit: {
        clientId: string | null;
        clientSecret: string | null;
        username: string | null;
        password: string | null;
        subreddit: string | null;
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
        instagram: {
            accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || null,
            businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || null,
            appId: process.env.INSTAGRAM_APP_ID || null,
            appSecret: process.env.INSTAGRAM_APP_SECRET || null
        },
        reddit: {
            clientId: process.env.REDDIT_CLIENT_ID || null,
            clientSecret: process.env.REDDIT_CLIENT_SECRET || null,
            username: process.env.REDDIT_USERNAME || null,
            password: process.env.REDDIT_PASSWORD || null,
            subreddit: process.env.REDDIT_SUBREDDIT || null
        },
        api: {
            interval: 16 * 60 * 1000 // 16 minutes in milliseconds
        }
    };
} 