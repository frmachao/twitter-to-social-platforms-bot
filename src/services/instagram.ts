import { Logger, ILogObj } from 'tslog';
import axios from 'axios';

export class InstagramService {
    private accessToken: string;
    private businessAccountId: string;
    private logger: Logger<ILogObj>;
    private readonly API_VERSION = 'v21.0';
    private readonly TOKEN_REFRESH_DAYS = 50; // 在令牌过期前 10 天刷新
    private readonly CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 每24小时检查一次
    private checkInterval: NodeJS.Timeout | null = null;

    constructor(accessToken: string, businessAccountId: string, logger: Logger<ILogObj>) {
        this.accessToken = accessToken;
        this.businessAccountId = businessAccountId;
        this.logger = logger;
    }

    async init() {
        try {
            await this.checkAndRefreshToken();
            // 启动定期检查
            this.startTokenCheck();
            
            const response = await axios.get(
                `https://graph.facebook.com/${this.API_VERSION}/me?access_token=${this.accessToken}`
            );
            this.logger.info('📸 Connected to Instagram');
        } catch (e) {
            this.logger.error('Error connecting to Instagram:', e);
            throw e;
        }
    }

    private startTokenCheck() {
        // 清除可能存在的旧定时器
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        // 设置新的定时检查
        this.checkInterval = setInterval(async () => {
            try {
                await this.checkAndRefreshToken();
            } catch (e) {
                this.logger.error('Error in token check interval:', e);
            }
        }, this.CHECK_INTERVAL);
    }

    // 在服务关闭时清理
    async cleanup() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    private async checkAndRefreshToken() {
        try {
            // 检查令牌信息
            const response = await axios.get(
                `https://graph.facebook.com/${this.API_VERSION}/debug_token`,
                {
                    params: {
                        input_token: this.accessToken,
                        access_token: this.accessToken
                    }
                }
            );

            const expiresAt = response.data.data.expires_at;
            const daysUntilExpiry = Math.floor((expiresAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24));

            if (daysUntilExpiry <= this.TOKEN_REFRESH_DAYS) {
                this.logger.info(`Instagram token expires in ${daysUntilExpiry} days, refreshing...`);
                await this.refreshToken();
            } else {
                this.logger.info(`Instagram token valid for ${daysUntilExpiry} days`);
            }
        } catch (e) {
            this.logger.error('Error checking token expiry:', e);
            throw e;
        }
    }

    async postToInstagram(imageUrl: string, caption: string) {
        try {
            const containerResponse = await axios.post(
                `https://graph.facebook.com/${this.API_VERSION}/${this.businessAccountId}/media`,
                {
                    image_url: imageUrl,
                    caption: caption,
                    access_token: this.accessToken
                }
            );

            const containerId = containerResponse.data.id;

            await axios.post(
                `https://graph.facebook.com/${this.API_VERSION}/${this.businessAccountId}/media_publish`,
                {
                    creation_id: containerId,
                    access_token: this.accessToken
                }
            );

            this.logger.info('📤 Content posted to Instagram');
        } catch (e) {
            this.logger.error('Error posting to Instagram:', e);
            throw e;
        }
    }

    private async refreshToken() {
        try {
            const response = await axios.get(
                `https://graph.facebook.com/v21.0/oauth/access_token`,
                {
                    params: {
                        grant_type: 'fb_exchange_token',
                        client_id: process.env.INSTAGRAM_APP_ID,
                        client_secret: process.env.INSTAGRAM_APP_SECRET,
                        fb_exchange_token: this.accessToken
                    }
                }
            );
            this.accessToken = response.data.access_token;
            this.logger.info('🔄 Instagram token refreshed');
        } catch (e) {
            this.logger.error('Error refreshing Instagram token:', e);
            throw e;
        }
    }
} 