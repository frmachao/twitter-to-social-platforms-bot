# Twitter to Social Platforms Bot

## Overview

This bot monitors a specific Twitter user's tweets and forwards them in real-time to multiple social platforms:
- Telegram channels
- Discord channels
- Instagram (for tweets with images)

Built with TypeScript and Node.js, it utilizes:
- Twitter API v2
- Telegram Bot API
- Discord.js
- Instagram Graph API

## Features

- **Multi-Platform Support:** 
  - Forwards tweets to Telegram channels
  - Forwards tweets to Discord channels
  - Syncs tweets with images to Instagram
- **Real-Time Monitoring:** Continuously monitors tweets from a specified Twitter user
- **Smart Media Handling:** 
  - Detects tweets containing images
  - Automatically posts images to Instagram with original tweet link
- **Token Management:**
  - Automatic Instagram token refresh
  - Token expiry monitoring
  - Graceful token updates
- **Rate Limit Handling:** Smart handling of API rate limits for all platforms
- **Process Management:** Uses PM2 for process management and monitoring
- **Robust Logging:** Comprehensive logging system using tslog
- **Progress Visualization:** CLI progress bar for monitoring wait times

## Configuration

Required environment variables:
```env
# Twitter Configuration
TWITTER_BEARER_TOKEN=your_twitter_token
USER_TO_MONITOR=target_username

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_token
DISCORD_CHANNEL_ID=your_channel_id

# Instagram Configuration
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
```

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Build: `npm run build`
5. Start with PM2: `npm run pm2:start`

## Monitoring & Management

- View logs: `npm run pm2:logs`
- Monitor process: `npm run pm2:monitor`
- Restart service: `npm run pm2:restart`
- Stop service: `npm run pm2:stop`

## Error Handling

The bot handles various types of errors:
- Network connectivity issues
- API rate limits
- Token expiration
- Platform-specific errors
- Process management and recovery

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

Built with:
- [twitter-api-sdk](https://github.com/twitterdev/twitter-api-sdk)
- [telegraf](https://github.com/telegraf/telegraf)
- [discord.js](https://discord.js.org/)
- [instagram-graph-api](https://developers.facebook.com/docs/instagram-api/)
- [tslog](https://github.com/fullstack-build/tslog)
- [cli-progress](https://github.com/AndiDittrich/Node.CLI-Progress)
- [PM2](https://pm2.keymetrics.io/)


Created & Managed by Ricky Bharti

