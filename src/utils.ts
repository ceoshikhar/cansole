import { Button, Window } from "./ui/canvas";

function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

// TODO: instead of this we should have "child" <-> "parent" elements to be
// "drawn" relative to each other?
function positionButtonRelativeToWindow(button: Button, window: Window): void {
    const buttonPaddingWithWindow = 16;

    button.setR(window.r - buttonPaddingWithWindow);
    button.setB(window.b - buttonPaddingWithWindow);
}

export { isCanvas, positionButtonRelativeToWindow };
