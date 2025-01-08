# Twitter to Social Platforms Bot

A bot that monitors Twitter and forwards posts to multiple social platforms.

## Features

- Monitor specific Twitter user's tweets
- Forward tweets to:
  - Telegram channels
  - Discord channels
  - Instagram (for tweets with images)
  - Reddit subreddits
- Automatic token refresh for Instagram and Reddit
- Rate limit handling
- PM2 process management

## Configuration

The bot supports modular platform configuration. You can enable only the platforms you need by configuring their respective environment variables.

Required environment variables:
```env
# Twitter Configuration (Required)
TWITTER_BEARER_TOKEN=your_twitter_token
USER_TO_MONITOR=target_username

# Telegram Configuration (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Discord Configuration (Optional)
DISCORD_BOT_TOKEN=your_discord_token
DISCORD_CHANNEL_ID=your_channel_id

# Instagram Configuration (Optional)
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret

# Reddit Configuration (Optional)
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_username
REDDIT_PASSWORD=your_password
REDDIT_SUBREDDIT=target_subreddit
```

Note: Only Twitter configuration is required. Other platforms are optional and will be enabled only if their configuration is provided.

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



