import * as types from "./types";
import * as ui from "./ui";

function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

function positionButtonRelativeToWindow(
    cansole: types.Cansole
): void {
    const toRender = cansole.toRenderForCanvas;

    // Sanity check.
    if (!toRender) return;

    const button = toRender.button;
    const window = toRender.window;
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
