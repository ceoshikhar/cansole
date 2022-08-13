/**
 * Options to configure a `Cansole` instance.
 */
type Options = {
    element: HTMLCanvasElement | HTMLDivElement;
};

/**
 * Represents a `Cansole`.
 */
type Cansole = {
    target: Target;
    visibility: Visibility;
};

/**
 * Where and how to render the `Cansole`.
 *
 * NOTE: Currently `Cansole` supports only `Target.Canvas`.
 */
enum Target {
    /**
     * Renders using `<canvas>`.
     */
    Canvas = "Canvas",

    /**
     * Render using other HTML elements like `<div>`, `<button>`, `<input>` and etc.
     */
    NotCanvas = "NotCanvas",
}

/**
 * Whether `Cansole` is currently visible or hidden.
 */
enum Visibility {
    /**
     * Show the `Cansole`.
     */
    Visible = "Visible",

    /**
     * Hide the `Cansole`.
     */
    Hidden = "Hidden",
}

export { Cansole, Options, Target, Visibility };
