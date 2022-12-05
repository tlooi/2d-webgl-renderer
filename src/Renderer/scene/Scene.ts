import { Geometry } from "../geometry/geometry";
import Renderer from "../renderer";

export default class Scene {
    private objects: Map<string, Geometry[]> = new Map();
    private renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    public add(object: Geometry) {
        const objects = this.objects.get(object.getTextureName());
        if (objects) {
            objects.push(object);
        } else {
            this.objects.set(object.getTextureName(), [object]);
        }
    }

    public render() {
        const gl = this.renderer.getGL();
        // batch by textures (category)
        // can render layers via stacked scenes
        this.objects.forEach((category) => {
            const buffer = this.renderer.getBufferData();
            category.forEach((obj) => {
                const [
                    topLeft,
                    topRight,
                    bottomRight,
                    bottomLeft
                ] = obj.getBounds();
                const [
                    uvTopLeft,
                    uvTopRight,
                    uvBottomRight,
                    uvBottomLeft
                ] = obj.getUvBounds();

                buffer.add(
                    ...topLeft, 1, 1, 1, ...uvTopLeft,
                    ...topRight, 1, 1, 1, ...uvTopRight,
                    ...bottomRight, 1, 1, 1, ...uvBottomRight,

                    ...topLeft, 1, 1, 1, ...uvTopLeft,
                    ...bottomRight, 1, 1, 1, ...uvBottomRight,
                    ...bottomLeft, 1, 1, 1, ...uvBottomLeft,
                );
            });

            this.renderer.useTexture(category[0].getTextureName());

            const [length, data] = buffer.valueOf();
            console.log(length, data, category[0].getTextureName());
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            gl.drawArrays(gl.TRIANGLES, 0, length / 7);
        });
    }
}