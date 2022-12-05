import './style.css';

import Renderer from './Renderer';
import { fSource, vSource } from './shaders';

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const context = canvas.getContext('webgl');

if (!context) {
    throw new Error('[ERROR] WebGL not supported!')
}

const R = new Renderer(context, vSource, fSource);
R.addAttribute('a_position', 2, 0, 28);
R.addAttribute('a_color', 3, 8, 28);
R.addAttribute('a_texCoord', 2, 20, 28);
R.addUniform('u_resolution', [canvas.width, canvas.height]);
R.createTexture('./BLDtutorial.png', 'BLDtutorial');
R.createTexture('./world.png', 'world');

setTimeout(() => {
    console.log(R.getTextures());
    R.draw();
}, 100);