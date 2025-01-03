import { Telegraf } from 'telegraf';
import { Logger, ILogObj } from 'tslog';

export class TelegramService {
    private bot: Telegraf;
    private chatId: string;
    private logger: Logger<ILogObj>;

    constructor(botToken: string, chatId: string, logger: Logger<ILogObj>) {
        this.bot = new Telegraf(botToken);
        this.chatId = chatId;
        this.logger = logger;
    }

    async init() {
        try {
            await this.bot.telegram.getMe();
            this.logger.info('🤖 Connected to Telegram');
        } catch (e) {
            this.logger.error('Error connecting to Telegram:', e);
            throw e;
        }
    }

    async sendMessage(message: string) {
        try {
            await this.bot.telegram.sendMessage(this.chatId, message);
            this.logger.info('📩 Message sent to Telegram');
        } catch (e) {
            this.logger.error('Error sending message to Telegram:', e);
            throw e;
        }
    }
} 