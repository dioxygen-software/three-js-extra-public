export declare class FPSCounter {
    /** Maximum number of frames for which we compute the delay */
    static MAX_FRAME_COUNT: number;
    /** Up to MAX_FRAME_COUNT timestamps of the animationFrame request */
    lastRenderTimestamps: number[];
    private animationFrameRequest;
    constructor();
    private countFPS;
    /** @return Average fps over the last MAX_FRAME_COUNT frames */
    getAvgFps(): number;
    /** @return Current FPS computed based base on the delay between the last 2 frames */
    getFps(): number;
    [Symbol.dispose](): void;
}
//# sourceMappingURL=FPSUtils.d.ts.map