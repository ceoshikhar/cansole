import * as events from "./events";
import * as utils from "./utils";
import { CanvasUI, Drawable } from "./ui/canvas";
import { EventEmitter } from "./event-emitter";

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

/**
 * Represents a `Cansole`.
 */
class Cansole implements Drawable {
    public element: CansoleElement;
    public target: Target;
    public visibility: Visibility;

    private ee: EventEmitter;

    private canvasUI: CanvasUI | null;

    /**
     * Create a new instance of `Cansole`.
     */
    constructor(options: CansoleOptions) {
        const { element } = options;

        this.element = element;
        this.target = this.detectTarget(element);
        this.visibility = Visibility.Hidden;

        this.ee = new EventEmitter();

        this.canvasUI = null;

        if (this.target === Target.Canvas) {
            this.canvasUI = new CanvasUI(this);
        }

        this.initToggleKeyListener("Backquote");
    }

    /**
     * Hides the console.
     */
    public hide(): void {
        this.visibility = Visibility.Hidden;

        this.ee.emit(events.CansoleEvents.Hide, this);
        // TODO: Idk where to put this. This exist because I don't want to
        // leave the cursor to be anything other than `auto`.
        this.element.style.cursor = "auto";
    }

    public onHide(cb: (cansole: Cansole) => void): void {
        this.ee.on(events.CansoleEvents.Hide, cb);
    }

    /**
     * Shows the console.
     */
    public show(): void {
        this.visibility = Visibility.Visible;

        this.ee.emit(events.CansoleEvents.Show, this);
    }

    public onShow(cb: (cansole: Cansole) => void): void {
        this.ee.on(events.CansoleEvents.Show, cb);
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
        // Cansole is hidden, so don't draw anything.
        if (this.visibility === Visibility.Hidden) {
            return;
        }

        if (this.target === Target.Canvas) {
            if (this.canvasUI === null) {
                throw new Error(
                    "Cansole.draw: this.canvasUI is null. This" +
                        " shouldn't have happened. Did `this.target` change at" +
                        " runtime during the lifecycle of Cansole?"
                );
            }

            this.canvasUI.draw();
        } else {
            throw new Error(
                "Cansole.render: currently we can render to HTMLCanvasElement" +
                    " only and the provided cansole.element is not HTMLCanvasElement."
            );
        }
    }

    private detectTarget(element: HTMLElement): Target {
        if (utils.isCanvas(element)) {
            return Target.Canvas;
        }

        return Target.NotCanvas;
    }

    private initToggleKeyListener(keycode: string): void {
        document.addEventListener("keyup", (event) => {
            if (event.code === keycode) {
                this.toggle();
            }
        });
    }
}

export { Cansole, Visibility };
