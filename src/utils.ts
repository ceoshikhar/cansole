import * as types from "./types";
import * as ui from "./ui";

function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

function positionButtonRelativeToWindow(
    cansole: types.Cansole
): void {
    const button = cansole.button!;
    const window = cansole.window!;
    const buttonPaddingWithWindow = 10;

    ui.canvas.shapes.rect.setR(
        button.rect,
        window.rect.r - buttonPaddingWithWindow
    );
    ui.canvas.shapes.rect.setB(
        button.rect,
        window.rect.b - buttonPaddingWithWindow
    );
}

export { isCanvas, positionButtonRelativeToWindow };
