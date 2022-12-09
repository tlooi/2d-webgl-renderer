import BufferData from './buffer_data';
import { AttribLocation, UniformLocation } from "./location";
import Texture from "./texture";

import { fSource, vSource } from "./shaders";

type TPair = [number, number];

type TBounds = [TPair, TPair, TPair, TPair];

export default class Renderer {
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;
    private buffer: WebGLBuffer;
    private textures: { [key: string]: Texture } = {};
    private attributes: { [name: string]: AttribLocation } = {};
    private uniforms: { [name: string]: UniformLocation } = {};
    private bufferData: BufferData = new BufferData(10000, { autoClearOnValueOf: true, vertexLength: 7 });

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.program = this.createProgram();
        this.createShaders(this.program, vSource, fSource);
        this.buffer = this.createBuffer();
        this.bindBuffer(this.buffer);
        this.setup();
    }

    private setup() {
        this.createTexture({ src: './src/Renderer/base/pixel.png', name: 'pixel' });

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);


        this.addAttribute('a_position', 2, 0, 28);
        this.addAttribute('a_color', 3, 8, 28);
        this.addAttribute('a_texCoord', 2, 20, 28);
        this.addUniform('u_resolution', [this.gl.canvas.width, this.gl.canvas.height]);
        this.addUniform('u_texture', [0]);
    }

    private bindBuffer(buffer: WebGLBuffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    }

    private createProgram() {
        const program = this.gl.createProgram();
        if (!program) {
            throw new Error('[ERROR] There appears to be a problem create the WebGL Program');
        }

        return program;
    }

    private createBuffer() {
        const buffer = this.gl.createBuffer();
        if (buffer === null) {
            throw new Error('[ERROR] There appears to be a problem creating buffer');
        }

        return buffer;
    }

    private createShaders(program: WebGLProgram, vSource: string, fSource: string) {
        const fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        const vshader = this.gl.createShader(this.gl.VERTEX_SHADER);

        if (!fshader || !vshader) {
            throw new Error('[ERROR] There appears to be a problem creating shaders');
        }

        this.gl.shaderSource(vshader, vSource);
        this.gl.shaderSource(fshader, fSource);

        this.gl.compileShader(vshader);
        this.gl.compileShader(fshader);

        this.gl.attachShader(program, vshader);
        this.gl.attachShader(program, fshader);

        const programInfoLog = this.gl.getProgramInfoLog(program);
        const vshaderInfoLog = this.gl.getShaderInfoLog(vshader);
        const fshaderInfoLog = this.gl.getShaderInfoLog(fshader);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);
        programInfoLog && console.log(programInfoLog);
        vshaderInfoLog && console.log(vshaderInfoLog);
        fshaderInfoLog && console.log(fshaderInfoLog);
    }

    public loadTextures(textures: { name: string, src: string }[], callback: () => void) {
        Promise.all(
            textures.map(val => this.createTexture(val))
        ).then(() => {
            callback();
        }).catch(() => {
            throw new Error('[ERROR] Texture could not be loaded');
        });
    }

    public addAttribute(name: string, size: number, offset: number, stride: number) {
        this.attributes[name] = new AttribLocation({
            gl: this.gl,
            program: this.program,
            name,
            size,
            offset,
            stride
        });
    }

    public addUniform(name: string, values: number[]) {
        this.uniforms[name] = new UniformLocation({
            gl: this.gl,
            program: this.program,
            name,
            values
        });
    }

    public createTexture({ src, name }: { src: string, name: string }) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const { width, height } = { width: img.width, height: img.height };

                this.textures[name] = new Texture({
                    gl: this.gl,
                    height,
                    width,
                    src,
                    image: img,
                });

                resolve(true);
            }

            img.onerror = () => reject(false);

            img.src = src;
        });
    }

    public getGL() {
        return this.gl;
    }

    public getBufferData() {
        return this.bufferData;
    }

    public getTextures() {
        return this.textures;
    }

    public useTexture(name: string) {
        if (!this.textures[name]) {
            throw new Error(`[ERROR] Texture{${name}} does not exist`);
        }
        const texture = this.textures[name];
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.valueOf());
    }

    public drawTexture(x: number, y: number, width: number, height: number) {
        this.bufferData.add(
            x - width / 2, y + height / 2, 1, 1, 1, 0, 0,
            x + width / 2, y + height / 2, 1, 1, 1, 1, 0,
            x + width / 2, y - height / 2, 1, 1, 1, 1, 1,

            x - width / 2, y + height / 2, 1, 1, 1, 0, 0,
            x + width / 2, y - height / 2, 1, 1, 1, 1, 1,
            x - width / 2, y - height / 2, 1, 1, 1, 0, 1
        );
    }

    public drawTextureUV(x: number, y: number, width: number, height: number, bounds: TBounds) {
        this.bufferData.add(
            x - width / 2, y + height / 2, 1, 1, 1, bounds[0][0], bounds[0][1],
            x + width / 2, y + height / 2, 1, 1, 1, bounds[1][0], bounds[1][1],
            x + width / 2, y - height / 2, 1, 1, 1, bounds[2][0], bounds[2][1],

            x - width / 2, y + height / 2, 1, 1, 1, bounds[0][0], bounds[0][1],
            x + width / 2, y - height / 2, 1, 1, 1, bounds[2][1], bounds[2][1],
            x - width / 2, y - height / 2, 1, 1, 1, bounds[3][0], bounds[3][1]
        );
    }

    public render() {
        this.useTexture('BLDtutorial');

        this.drawTexture(0, 0, 240 * 8, 160 * 8);
        let [length, data] = this.bufferData.valueOf();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, length);

        this.useTexture('world');

        this.drawTexture(0, 0, 512, 512);
        [length, data] = this.bufferData.valueOf();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, length);

        this.useTexture('Bison');

        this.drawTextureUV(0, 0, 512, 512, [
            [0, 0],
            [0.27, 0],
            [0.27, 0.27],
            [0, 0.27]
        ]);
        [length, data] = this.bufferData.valueOf();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, length);
    }
}