interface ITextureConstructor {
    gl: WebGLRenderingContext;
    src: string;
    width: number;
    height: number;
    image: HTMLImageElement;
}

export default class Texture {
    private static id = 0;

    private src: string;
    private width: number;
    private height: number;
    private id: number;
    private texture: WebGLTexture;

    constructor({ gl, src, width, height, image }: ITextureConstructor) {
        if (Texture.id > 7) {
            throw new Error('[ERROR] Cannot have more than 8 textures');
        }
        
        this.src = src;
        this.width = width;
        this.height = height;
        this.id = Texture.id++;

        const texture = gl.createTexture();
        if (texture === null) throw new Error('[ERROR] Unable to create texture');
        this.texture = texture;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    public getSrc() {
        return this.src;
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getId() {
        return this.id;
    }

    public valueOf() {
        return this.texture;
    }
}