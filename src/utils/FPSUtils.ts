

export class FPSCounter {

    /** Maximum number of frames for which we compute the delay */
    static MAX_FRAME_COUNT = 60;

    /** Up to MAX_FRAME_COUNT timestamps of the animationFrame request */
    lastRenderTimestamps: number[] = [];

    private animationFrameRequest: number = 0;

    constructor() {
        const countFPS = () => {
            this.countFPS();
            this.animationFrameRequest = requestAnimationFrame(countFPS);
        }
        countFPS();
    }

    private countFPS() {
        // only keep last 60 render times
        if (this.lastRenderTimestamps.length >= FPSCounter.MAX_FRAME_COUNT) {
            this.lastRenderTimestamps.splice(0, 1);
        }
        this.lastRenderTimestamps.push(Date.now());
    }

    /** @return Average fps over the last MAX_FRAME_COUNT frames */
    getAvgFps(): number {

        if (this.lastRenderTimestamps.length < 2) {
            return 0;
        }
        const ts = this.lastRenderTimestamps;
        return 1000 * ts.length / (ts[ts.length - 1] - ts[0]);
    }

    /** @return Current FPS computed based base on the delay between the last 2 frames */
    getFps(): number {
        if (this.lastRenderTimestamps.length < 2) {
            return 0;
        }
        const ts = this.lastRenderTimestamps;
        return 1000 / (ts[ts.length - 1] - ts[ts.length - 2]);
    }

    [Symbol.dispose] () {
        cancelAnimationFrame(this.animationFrameRequest);
    }
}