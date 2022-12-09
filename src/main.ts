import './style.css';

import Renderer from './Renderer';

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const context = canvas.getContext('webgl');

if (!context) {
    throw new Error('[ERROR] WebGL not supported!')
}
const R = new Renderer(context);