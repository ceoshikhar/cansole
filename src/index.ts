import * as Cansole from "./cansole";

function main() {
    const canvas: HTMLCanvasElement = document.getElementById(
        "my-canvas"
    ) as HTMLCanvasElement;

    canvas.height = window.innerHeight - 10;
    canvas.width = window.innerWidth - 10;

    const cansole = Cansole.create({ element: canvas });

    Cansole.show(cansole);
}

main();
