import { TBounds } from "../renderer";

type TAnimationOptions = {
    textureName: string;
    defaultAnimation: string;
    animations: {
        [key: string]: {
            frameDuration: number;
            numFrames: number;
            bounds: TBounds[];
        }
    }
}

// TODO
export class Sprite {
    
    public getBounds(): TBounds {
        return [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1]
        ];
    }

    public getTextureName() {
        return 'pixel';
    }
}

export class AnimatedSprite extends Sprite {
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private options: TAnimationOptions;
    
    private currentAnimation: string;
    private currentFrame: number = 0; 
    private tick = 0;

    constructor(x: number, y: number, width: number, height: number, options: TAnimationOptions) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.options = options;

        if (!options.animations[options.defaultAnimation]) {
            throw new Error('[ERROR] Must contain at least one animation key');
        }
        this.currentAnimation = options.defaultAnimation;
    }

    public play() {

    }

    public stop() {

    }

    public update() {
        this.tick++;

        if (this.tick % this.options.animations[this.currentAnimation].frameDuration === 0) {
            this.currentFrame++;
        }
    }
    
    public getBounds(): TBounds {
        const numFrames = this.options.animations[this.currentAnimation].numFrames;
        return this.options.animations[this.currentAnimation].bounds[this.currentFrame % numFrames];
    }

    public getRenderLocation() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    public getTextureName(): string {
        return this.options.textureName;
    }
}