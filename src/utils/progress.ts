import cliProgress from 'cli-progress';
import { setTimeout } from 'timers/promises';

export async function showProgress(totalTime: number, description: string) {
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(100, 0);

    const updateInterval = totalTime / 100;
    for (let i = 0; i <= 100; i++) {
        await setTimeout(updateInterval);
        progressBar.update(i);
    }

    progressBar.stop();
} 