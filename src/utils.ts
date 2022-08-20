import * as types from "./types";

function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

function positionButtonRelativeToWindow(cansole: types.Cansole): void {
    const renderables = cansole.canvasRenderables;

    // Sanity check because at this moment
    if (!renderables) return;

    const button = renderables.button;
    const window = renderables.window;
    const buttonPaddingWithWindow = 16;

    button.box.setR(window.box.r - buttonPaddingWithWindow);
    button.box.setB(window.box.b - buttonPaddingWithWindow);
}

export { isCanvas, positionButtonRelativeToWindow };
