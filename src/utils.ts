import { Button, Window } from "./ui/canvas";

/**
 * Simple wrapper over `canvas.getContext("2d")` which does the `null` check.
 */
function getContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext("2d");

    if (ctx === null) {
        throw new Error(
            "getContext2D: failed to get 2D rendering context from the canvas."
        );
    }

    return ctx;
}

function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

export { getContext2D, isCanvas };
