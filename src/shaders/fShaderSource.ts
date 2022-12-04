export const fShaderSource = `
precision highp float;

uniform sampler2D u_texture;

varying vec3 v_color;
varying vec2 v_texCoord;

void main() {
    gl_FragColor = vec4(v_color, 1.0) * texture2D(u_texture, v_texCoord);
}
`;