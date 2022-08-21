import { Cansole } from "./api";

const canvas: HTMLCanvasElement = document.getElementById(
    "my-canvas"
) as HTMLCanvasElement;

canvas.height = window.innerHeight - 10;
canvas.width = window.innerWidth - 10;

const cansole = new Cansole({ element: canvas });

// Make sure Cansole is visible, else nothing will render.
cansole.show();

// Only **First** render is outside the render loop.
cansole.draw();

// Start render loop.
window.requestAnimationFrame(renderLoop(0));

function renderLoop(t1: number) {
    return function (t2: number) {
        if (t2 - t1 > 16.66) {
            const ctx = canvas.getContext('2d');
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            ctx!.fillStyle = "#888888";
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
            cansole.draw();
            requestAnimationFrame(renderLoop(t2));
        } else {
            requestAnimationFrame(renderLoop(t1));
        }
    };
}
