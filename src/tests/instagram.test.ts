import { InstagramService } from '../services/instagram';
import { Logger, ILogObj } from 'tslog';
import { config } from 'dotenv';
import axios from 'axios';

config();

const logger = new Logger<ILogObj>({ name: "TestLogger" });

async function downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

async function testInstagramService() {
    try {
        console.log('🧪 Starting Instagram Service test...');

        const instagram = new InstagramService(
            process.env.INSTAGRAM_ACCESS_TOKEN!,
            process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!,
            logger
        );

        // 测试初始化
        console.log('Testing initialization...');
        await instagram.init();
        console.log('✅ Initialization successful');

        // 测试发帖
        console.log('Testing post submission...');
        const testImageUrl = 'https://pbs.twimg.com/media/GgwqXlBacAAC9a3?format=jpg';
        const testCaption = `On New Year's Eve 2025, the sky came alive as countless balloons were set free, carrying hopes and dreams for the year ahead. A magical moment to welcome the future! 🎈✨ #NewYearsEve #2025 #HopeInTheAir`;
        
        // 下载测试图片
        console.log('Downloading test image...');
        const imageBuffer = await downloadImage(testImageUrl);
        console.log('✅ Image download successful');

        // 发布帖子
        await instagram.postToInstagram(testImageUrl, testCaption);
        console.log('✅ Post submission successful');

        // 测试清理
        console.log('Testing cleanup...');
        await instagram.cleanup();
        console.log('✅ Cleanup successful');

        console.log('🎉 All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// 运行测试
testInstagramService().catch(console.error); 