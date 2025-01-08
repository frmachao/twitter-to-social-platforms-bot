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
        accessToken: string;
        businessAccountId: string;
        appId: string;
        appSecret: string;
    };
    reddit: {
        clientId: string;
        clientSecret: string;
        username: string;
        password: string;
        subreddit: string;
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
        'INSTAGRAM_ACCESS_TOKEN',
        'INSTAGRAM_BUSINESS_ACCOUNT_ID',
        'USER_TO_MONITOR',
        'REDDIT_CLIENT_ID',
        'REDDIT_CLIENT_SECRET',
        'REDDIT_USERNAME',
        'REDDIT_PASSWORD',
        'REDDIT_SUBREDDIT'
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
            accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
            businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!,
            appId: process.env.INSTAGRAM_APP_ID!,
            appSecret: process.env.INSTAGRAM_APP_SECRET!
        },
        reddit: {
            clientId: process.env.REDDIT_CLIENT_ID!,
            clientSecret: process.env.REDDIT_CLIENT_SECRET!,
            username: process.env.REDDIT_USERNAME!,
            password: process.env.REDDIT_PASSWORD!,
            subreddit: process.env.REDDIT_SUBREDDIT!
        },
        api: {
            interval: 16 * 60 * 1000 // 16 minutes in milliseconds
        }
    };
} 