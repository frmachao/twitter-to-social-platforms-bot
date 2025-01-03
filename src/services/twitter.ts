import { Client } from 'twitter-api-sdk';
import { Logger, ILogObj } from 'tslog';

export class TwitterService {
    private client: Client;
    private logger: Logger<ILogObj>;

    constructor(bearerToken: string, logger: Logger<ILogObj>) {
        try {
            this.client = new Client(bearerToken);
            this.logger = logger;
        } catch (e) {
            logger.error('Error creating Twitter client:', e);
            throw e;
        }
    }

    async init() {
        this.logger.info('🐦 Connected to Twitter API');
    }

    async getUserId(username: string): Promise<string> {
        const user = await this.client.users.findUserByUsername(username, { 
            'user.fields': ['id'] 
        });
        if (!user.data) {
            throw new Error("User not found");
        }
        return user.data.id;
    }

    async getTweets(userId: string, lastTweetId: string | null, startTime: string) {
        return await this.client.tweets.usersIdTweets(userId, {
            since_id: lastTweetId || undefined,
            max_results: 5,
            'tweet.fields': ['id', 'text', 'author_id', 'created_at'],
            expansions: ['author_id'],
            start_time: startTime
        });
    }
} 