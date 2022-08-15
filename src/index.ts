import { cansole } from "./api";

const canvas: HTMLCanvasElement = document.getElementById(
    "my-canvas"
) as HTMLCanvasElement;

canvas.height = window.innerHeight - 10;
canvas.width = window.innerWidth - 10;

const div: HTMLDivElement = document.getElementById("my-div") as HTMLDivElement;

const myCansole = cansole.create({ element: canvas });

// console.log(cansole);

// Make sure Cansole is visible, else nothing will render.
cansole.show(myCansole);

// Only **First** render is outside the render loop.
cansole.render(myCansole);

// Start render loop.
window.requestAnimationFrame(renderLoop(0));

function renderLoop(t1: number) {
    return function (t2: number) {
        // stats.begin();

        if (t2 - t1 > 16.66) {
            const ctx = canvas.getContext('2d');
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            cansole.render(myCansole);
            requestAnimationFrame(renderLoop(t2));
        } else {
            requestAnimationFrame(renderLoop(t1));
        }

        // stats.end();
    };
}
