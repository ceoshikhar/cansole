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

 export { getContext2D };
