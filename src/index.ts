import { Cansole } from "./api";

const canvas: HTMLCanvasElement = document.getElementById(
    "my-canvas"
) as HTMLCanvasElement;

canvas.height = window.innerHeight - 10;
canvas.width = window.innerWidth - 10;

const div: HTMLDivElement = document.getElementById("my-div") as HTMLDivElement;

const cansole = Cansole.create({ element: canvas });

// console.log(cansole);

// Make sure Cansole is visible, else nothing will render.
Cansole.show(cansole);

// Only **First** render is outside the render loop.
Cansole.render(cansole);

// Start render loop.
window.requestAnimationFrame(renderLoop(0));

function renderLoop(t1: number) {
    return function (t2: number) {
        // stats.begin();

        if (t2 - t1 > 16.66) {
            Cansole.render(cansole);
            requestAnimationFrame(renderLoop(t2));
        } else {
            requestAnimationFrame(renderLoop(t1));
        }

        // stats.end();
    };
}
