import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { Logger, ILogObj } from 'tslog';

export class DiscordService {
    private client: Client;
    private channelId: string;
    private logger: Logger<ILogObj>;
    private botToken: string;

    constructor(botToken: string, channelId: string, logger: Logger<ILogObj>) {
        this.client = new Client({ 
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
            ]
        });
        this.channelId = channelId;
        this.logger = logger;
        this.botToken = botToken;
    }

    async init() {
        try {
            await this.client.login(this.botToken);
            this.logger.info('🎮 Connected to Discord');
        } catch (e) {
            this.logger.error('Error connecting to Discord:', e);
            throw e;
        }
    }

    async sendMessage(message: string) {
        try {
            const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
            await channel.send(message);
            this.logger.info('📨 Message sent to Discord');
        } catch (e) {
            this.logger.error('Error sending message to Discord:', e);
            throw e;
        }
    }
} 