import * as utils from "./utils";
import * as ui from "./ui";
import { Drawable } from "./ui/canvas/interfaces/Drawable";

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

/**
 * HTML element where `Cansole` will be rendered.
 */
type CansoleElement = HTMLCanvasElement | HTMLDivElement;

/**
 * Options to configure a `Cansole` instance.
 */
type CansoleOptions = {
    element: CansoleElement;
};

function detectTarget(element: HTMLElement): Target {
    if (utils.isCanvas(element)) {
        return Target.Canvas;
    }

    return Target.NotCanvas;
}

/**
 * Represents a `Cansole`.
 */
class Cansole implements Drawable {
    element: CansoleElement;
    target: Target;
    visibility: Visibility;

    // When `Cansole` is rendered to `Target.Canvas`, this is what we render.
    canvasRenderables?: ui.canvas.Renderables;

    /**
     * Create a new instance of `Cansole`.
     */
    constructor(options: CansoleOptions) {
        const { element } = options;

        this.element = element;
        this.target = detectTarget(element);
        this.visibility = Visibility.Hidden;

        if (this.target === Target.Canvas) {
            ui.canvas.setup(this);
        }
    }

    /**
     * Shows the console.
     */
    public show(): void {
        this.visibility = Visibility.Visible;
    }

    /**
     * Hides the console.
     */
    public hide(): void {
        this.visibility = Visibility.Hidden;
    }

    /**
     * Toggles the visibility of the console.
     *
     * If `show` -> `hide` else `hide` -> `show`.
     */
    public toggle(): void {
        if (this.visibility === Visibility.Visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Renders the console.
     *
     * If `element` is `HTMLCanvasElement` then make sure that `render` is
     * called inside your game render loop(usually `requestAnimationFrame`) so
     * that `Cansole` is rendered at every frame otherwise `Cansole` will be
     * static and "non-reactive" and the inputs like clicks, typing command in
     * text input, dragging the windowa and etc won't work.
     *
     * Make sure that you call it at the very end of your game render loop so
     * that `Cansole` is rendered at the top of everything else rnedered on the
     * `HTMLCanvasElement`.
     */
    public draw(): void {
        if (this.target === Target.Canvas) {
            ui.canvas.render(this);
        } else {
            throw new Error(
                "Cansole.render: currently we can render to HTMLCanvasElement" +
                    " only and the provided cansole.element is not HTMLCanvasElement."
            );
        }
    }
}

export { Cansole, Visibility };
