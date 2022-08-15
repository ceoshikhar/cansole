/**
 * HTML element where `Cansole` will be rendered.
 */
type CansoleElement = HTMLCanvasElement | HTMLDivElement;

/**
 * Represents a `Cansole`.
 */
type Cansole = {
    element: CansoleElement;
    target: Target;
    visibility: Visibility;
};

/**
 * Rendering context for `Target.Canvas`.
 */
type Context2D = CanvasRenderingContext2D;

/**
 * Options to configure a `Cansole` instance.
 */
type Options = {
    element: CansoleElement;
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

export { Cansole, Context2D, Options, Target, Visibility };
