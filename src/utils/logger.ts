import { Logger, ILogObj } from 'tslog';

export const logger = new Logger<ILogObj>({ name: "BotLogger" });

export function logWithEmoji(message: string, emoji: string) {
    logger.info(`${emoji} ${message}`);
} 