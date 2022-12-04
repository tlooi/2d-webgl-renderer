interface IOptions {
    autoClearOnValueOf: boolean
}

export default class BufferData {
    private options: Partial<IOptions>;
    private buffer: Float32Array;
    private maxSize: number;
    private length: number;

    constructor(size: number, options: Partial<IOptions> = {}) {
        this.options = options;
        this.maxSize = size;
        this.buffer = new Float32Array(this.maxSize);
        this.length = 0;
    }

    public add(...values: number[]) {
        if (this.length + values.length > this.maxSize) {
            throw new Error('[ERROR] Buffer does not have enough space');
        }

        this.buffer.set(values, this.length);
        this.length += values.length;
    }

    public clear() {
        this.length = 0;
    }

    public valueOf() {
        if (this.options.autoClearOnValueOf) {
            this.clear();
        }

        return this.buffer;
    }
}