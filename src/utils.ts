import { Cansole } from "./Cansole";

function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

// TODO: instead of this we should have "child" <-> "parent" elements to be
// "drawn" relative to each other?
function positionButtonRelativeToWindow(cansole: Cansole): void {
    const renderables = cansole.canvasRenderables;

    // Sanity check because at this moment
    if (!renderables) return;

    const button = renderables.submitButton;
    const window = renderables.window;

    const buttonPaddingWithWindow = 16;

    button.setR(window.box.r - buttonPaddingWithWindow);
    button.setB(window.box.b - buttonPaddingWithWindow);
}

export { isCanvas, positionButtonRelativeToWindow };
