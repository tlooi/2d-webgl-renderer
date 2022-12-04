interface ILocationConstruct {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    name: string;
};

type TAttribConstruct = ILocationConstruct & {
    offset: number;
    stride: number;
    size: number;
};

type TUniformConstruct = ILocationConstruct & {
    values: number[];
};

abstract class WebGLLocation {
    public abstract getLocation(): number | WebGLUniformLocation;
}

export class AttribLocation extends WebGLLocation {
    private location: number;

    constructor({ gl, program, name, size, stride, offset }: TAttribConstruct) {
        super();

        const location = gl.getAttribLocation(program, name);
        if (location === -1) {
            throw new Error('[WARNING] Attribute does not exist');
        }

        this.location = location;

        gl.enableVertexAttribArray(this.location);
        gl.vertexAttribPointer(this.location, size, gl.FLOAT, false, stride, offset);
    }

    public getLocation() {
        return this.location;
    }
}

export class UniformLocation extends WebGLLocation {
    private location: WebGLUniformLocation;
    private gl: WebGLRenderingContext;

    constructor({ gl, program, name, values }: TUniformConstruct) {
        super();

        const location = gl.getUniformLocation(program, name);
        if (location === null) {
            throw new Error('[WARNING] Uniform does not exist');
        }

        this.gl = gl;
        this.location = location;
        this.setValue(...values);
    }

    public getLocation() {
        return this.location;
    }

    public setValue(...values: number[]) {
        switch (values.length) {
            case 1:
                this.gl.uniform1fv(this.location, values);
                break;
            case 2:
                this.gl.uniform2fv(this.location, values);
                break;
            case 3:
                this.gl.uniform3fv(this.location, values);
                break;
            case 4:
                this.gl.uniform4fv(this.location, values);
                break;
            default:
                throw new Error('[ERROR] Unrecognized number of values inputted');
        }
    }
}