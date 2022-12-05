import { AttribLocation, UniformLocation } from "./location";
import Texture from "./texture";
import BufferData from './buffer_data';

export default class Renderer {
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;
    private buffer: WebGLBuffer;
    private textures: { [key: string]: Texture } = {};
    private attributes: { [name: string]: AttribLocation } = {};
    private uniforms: { [name: string]: UniformLocation } = {};
    private bufferData: BufferData = new BufferData(10000, { autoClearOnValueOf: true });

    constructor(gl: WebGLRenderingContext, vsource: string, fsource: string) {
        this.gl = gl;
        this.program = this.createProgram();
        this.createShaders(this.program, vsource, fsource);
        this.buffer = this.createBuffer();
        this.bindBuffer(this.buffer);
        this.setup();
    }

    private setup() {
        this.createTexture('./src/Renderer/base/pixel.png', 'pixel');

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
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

    private createShaders(program: WebGLProgram, vsource: string, fsource: string) {
        const fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        const vshader = this.gl.createShader(this.gl.VERTEX_SHADER);

        if (!fshader || !vshader) {
            throw new Error('[ERROR] There appears to be a problem creating shaders');
        }

        this.gl.shaderSource(vshader, vsource);
        this.gl.shaderSource(fshader, fsource);

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

    public createTexture(src: string, name: string) {
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
        }

        img.src = src;
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

    public draw() {
        this.uniforms['u_texture']?.setValue(0);

        this.bufferData.add(
            -120 * 8, 80 * 8, 1, 1, 1, 0, 0,
            120 * 8, 80 * 8, 1, 1, 1, 1, 0,
            120 * 8, -80 * 8, 1, 1, 1, 1, 1,

            -120 * 8, 80 * 8, 1, 1, 1, 0, 0,
            120 * 8, -80 * 8, 1, 1, 1, 1, 1,
            -120 * 8, -80 * 8, 1, 1, 1, 0, 1
        );

        let [length, data] = this.bufferData.valueOf();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        this.useTexture('BLDtutorial');
        this.gl.drawArrays(this.gl.TRIANGLES, 0, length / 7);

        this.useTexture('world');
        this.bufferData.add(
            -256, 256, 1, 1, 1, 0, 0,
            256, 256, 1, 1, 1, 1, 0,
            256, -256, 1, 1, 1, 1, 1,

            -256, 256, 1, 1, 1, 0, 0,
            256, -256, 1, 1, 1, 1, 1,
            -256, -256, 1, 1, 1, 0, 1
        );

        [length, data] = this.bufferData.valueOf();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        console.log(this.bufferData);
        console.log(this.uniforms);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, length / 7);
    }
}