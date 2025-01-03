# Twitter to Social Platforms Bot

## Overview

This bot monitors a specific Twitter user's tweets and forwards them in real-time to both Telegram and Discord platforms. Built with TypeScript and Node.js, it utilizes Twitter API v2, Telegram Bot API, and Discord.js to create a seamless cross-platform notification system.

## Features

- **Multi-Platform Support:** 
  - Forwards tweets to Telegram channels
  - Forwards tweets to Discord channels
- **Real-Time Monitoring:** Continuously monitors tweets from a specified Twitter user
- **Rate Limit Handling:** Smart handling of Twitter API rate limits
- **Process Management:** Uses PM2 for process management and monitoring
- **Robust Logging:** Comprehensive logging system using tslog
- **Progress Visualization:** CLI progress bar for monitoring wait times
- **Modular Architecture:** Well-organized, maintainable codebase

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/twitter-social-bot.git
   cd twitter-social-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install PM2 globally:**
   ```bash
   npm install pm2 -g
   ```

4. **Create a `.env` file:**
   ```plaintext
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   DISCORD_BOT_TOKEN=your_discord_bot_token
   DISCORD_CHANNEL_ID=your_discord_channel_id
   USER_TO_MONITOR=twitter_username_to_monitor
   ```

## Configuration

### Required Environment Variables:
- `TWITTER_BEARER_TOKEN`: Twitter API v2 Bearer Token
- `TELEGRAM_BOT_TOKEN`: Telegram Bot API Token
- `TELEGRAM_CHAT_ID`: Target Telegram channel/chat ID
- `DISCORD_BOT_TOKEN`: Discord Bot Token
- `DISCORD_CHANNEL_ID`: Target Discord channel ID
- `USER_TO_MONITOR`: Twitter username to monitor

### Discord Bot Setup:
1. Create a new application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot and get the token
3. Enable necessary bot permissions
4. Invite the bot to your server
5. Get the channel ID where notifications will be sent

## Usage

### Development:
```bash
npm run build
npm start
```

### Production:
```bash
npm run build
npm run pm2:start
```

### PM2 Commands:
- Start: `npm run pm2:start`
- Stop: `npm run pm2:stop`
- Restart: `npm run pm2:restart`
- View Logs: `npm run pm2:logs`
- Monitor: `npm run pm2:monitor`

## Project Structure
```
src/
├── config/
│   └── config.ts         # Configuration management
├── services/
│   ├── twitter.ts        # Twitter API service
│   ├── telegram.ts       # Telegram Bot service
│   └── discord.ts        # Discord Bot service
├── utils/
│   ├── logger.ts         # Logging utility
│   └── progress.ts       # Progress bar utility
└── index.ts             # Main application entry
```

## Error Handling
- Twitter API rate limits
- Network connectivity issues
- Platform-specific errors
- Process management and recovery

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

Built with:
- [twitter-api-sdk](https://github.com/twitterdev/twitter-api-sdk)
- [telegraf](https://github.com/telegraf/telegraf)
- [discord.js](https://discord.js.org/)
- [tslog](https://github.com/fullstack-build/tslog)
- [cli-progress](https://github.com/AndiDittrich/Node.CLI-Progress)
- [PM2](https://pm2.keymetrics.io/)

Created & Managed by Ricky Bharti
