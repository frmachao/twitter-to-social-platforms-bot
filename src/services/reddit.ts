import { Logger, ILogObj } from 'tslog';
import axios from 'axios';
import dayjs from 'dayjs';

export class RedditService {
    private accessToken: string | null = null;
    private tokenExpiresAt: number = 0;
    private readonly TOKEN_REFRESH_BUFFER = 300; // 在过期前 5 分钟刷新
    private readonly CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 每 12 小时检查一次
    private checkInterval: NodeJS.Timeout | null = null;
    private subreddit: string;
    private logger: Logger<ILogObj>;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly username: string;
    private readonly password: string;

    constructor(
        clientId: string,
        clientSecret: string,
        username: string,
        password: string,
        subreddit: string,
        logger: Logger<ILogObj>
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.username = username;
        this.password = password;
        this.subreddit = subreddit;
        this.logger = logger;
    }

    private async getAccessToken(): Promise<string> {
        const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const response = await axios.post('https://www.reddit.com/api/v1/access_token', 
            {
                grant_type: 'password',
                username: this.username,
                password: this.password
            },
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);
        const expiryTime = dayjs(this.tokenExpiresAt).format('YYYY-MM-DD HH:mm:ss');
        this.logger.info(`Reddit token will expire at ${expiryTime}`);
        return response.data.access_token;
    }

    private startTokenCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        this.checkInterval = setInterval(async () => {
            try {
                await this.checkAndRefreshToken();
            } catch (e) {
                this.logger.error('Error in token check interval:', e);
            }
        }, this.CHECK_INTERVAL);
    }

    private async checkAndRefreshToken() {
        const timeUntilExpiry = this.tokenExpiresAt - Date.now();
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
        
        if (timeUntilExpiry <= this.TOKEN_REFRESH_BUFFER * 1000) {
            this.logger.info(`Reddit token expires in ${minutesUntilExpiry} minutes, refreshing...`);
            this.accessToken = await this.getAccessToken();
            this.logger.info('Reddit token refreshed');
        } else {
            this.logger.info(`Reddit token valid for ${minutesUntilExpiry} minutes`);
        }
    }

    async init() {
        try {
            this.accessToken = await this.getAccessToken();
            this.startTokenCheck();
            this.logger.info('🎯 Connected to Reddit');
        } catch (e) {
            this.logger.error('Error connecting to Reddit:', e);
            throw e;
        }
    }

    async cleanup() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    async submitPost(text: string, tweetUrl: string) {
        if (!this.accessToken) {
            await this.init();
        }

        try {
            await axios.post('https://oauth.reddit.com/api/submit',
                {
                    sr: this.subreddit,
                    title: text.slice(0, 100),
                    link: tweetUrl,
                    kind: 'link',
                    resubmit: true
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            this.logger.info('📤 Post submitted to Reddit');
        } catch (e) {
            this.logger.error('Error posting to Reddit:', e);
            throw e;
        }
    }
} 