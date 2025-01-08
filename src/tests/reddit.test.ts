import { RedditService } from '../services/reddit';
import { Logger, ILogObj } from 'tslog';
import { config } from 'dotenv';

config();

const logger = new Logger<ILogObj>({ name: "TestLogger" });

async function testRedditService() {
    try {
        console.log('🧪 Starting Reddit Service test...');

        const reddit = new RedditService(
            process.env.REDDIT_CLIENT_ID!,
            process.env.REDDIT_CLIENT_SECRET!,
            process.env.REDDIT_USERNAME!,
            process.env.REDDIT_PASSWORD!,
            process.env.REDDIT_SUBREDDIT!,
            logger
        );

        // 测试初始化
        console.log('Testing initialization...');
        await reddit.init();
        console.log('✅ Initialization successful');

        // 测试发帖
        console.log('Testing post submission...');
        const testTweet = `Need Sepolia testETH/USDT? We got you! 🛡️

📍 Grab testnet tokens: http://discord.gg/GnGXn4REBs (testnet-faucet channel)

Wallet not connecting on QuestN? Quick fix:
- Use a browser extension wallet
- Try MetaMask 🦊 or some other wallets
- Turn off other blockers/extensions 🚫`;
        const testUrl = 'https://x.com/ShieldLayer/status/1873721711679746199';
        await reddit.submitPost(testTweet, testUrl);
        console.log('✅ Post submission successful');

        // 测试清理
        console.log('Testing cleanup...');
        await reddit.cleanup();
        console.log('✅ Cleanup successful');

        console.log('🎉 All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// 运行测试
testRedditService().catch(console.error); 