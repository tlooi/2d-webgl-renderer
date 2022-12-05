export const vShaderSource = `
precision highp float;

attribute vec2 a_position;
attribute vec3 a_color;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

varying vec3 v_color;
varying vec2 v_texCoord;

void main() {
    v_color = a_color;
    v_texCoord = a_texCoord;

    vec2 vec_pos = a_position / u_resolution * 2.0;
    
    gl_Position = vec4(vec_pos, 0.0, 1.0);
}
`;