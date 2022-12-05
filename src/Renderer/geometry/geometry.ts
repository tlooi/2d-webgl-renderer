type TOrderedPair = [number, number]
type TBounds = [TOrderedPair, TOrderedPair, TOrderedPair, TOrderedPair];

export abstract class Geometry {
    protected x: number;
    protected y: number;
    protected uvbounds: TBounds = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1]
    ];
    protected abstract bounds: TBounds;
    protected abstract textureName: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getUvBounds(): TBounds {
        return this.uvbounds;
    }

    public getTextureName() {
        return this.textureName;
    }

    public abstract getBounds(): TBounds;
}

export abstract class TexturedGeometry extends Geometry {
    constructor(x: number, y: number) {
        super(x, y);
    }

    public getUV() {
        return this.uvbounds;
    }
}

export class Rectangle extends Geometry {
    private width: number;
    private height: number;
    protected bounds: TBounds;
    protected textureName: string = 'pixel';

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width;
        this.height = height;

        this.bounds = [
            [this.x - this.width / 2, this.y + this.height / 2],
            [this.x + this.width / 2, this.y + this.height / 2],
            [this.x + this.width / 2, this.y - this.height / 2],
            [this.x - this.width / 2, this.y - this.height / 2]
        ];
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getBounds(): TBounds {
        return this.bounds;
    }
}

export class TexturedRectangle extends TexturedGeometry {
    private width: number;
    private height: number;
    protected bounds: TBounds;
    protected textureName: string = 'world';

    constructor(x: number, y: number, width: number, height: number, textureName: string) {
        super(x, y);

        this.width = width;
        this.height = height;

        this.bounds = [
            [this.x - this.width / 2, this.y + this.height / 2],
            [this.x + this.width / 2, this.y + this.height / 2],
            [this.x + this.width / 2, this.y - this.height / 2],
            [this.x - this.width / 2, this.y - this.height / 2]
        ];
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getBounds(): TBounds {
        return this.bounds;
    }
}