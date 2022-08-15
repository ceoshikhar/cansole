import * as utils from "./utils";
import * as types from "./types";
import * as ui from "./ui";

function getTarget(element: HTMLElement): types.Target {
    if (utils.isCanvas(element)) {
        return types.Target.Canvas;
    }

    return types.Target.NotCanvas;
}

/**
 * Create a new instance of `Cansole`.
 *
 * This is **not** a class instance but a data instance that represent a
 * `Cansole`. Almost if not all functions in the API will take this instance as
 * their first argument.
 *
 */
function create(options: types.Options): types.Cansole {
    const { element } = options;

    const target: types.Target = getTarget(element);
    const visibility: types.Visibility = types.Visibility.Hidden;

    const cansole: types.Cansole = {
        element,
        target,
        visibility,
    };

    return cansole;
}

/**
 * Shows the console.
 */
function show(cansole: types.Cansole): void {
    cansole.visibility = types.Visibility.Visible;
}

/**
 * Hides the console.
 */
function hide(cansole: types.Cansole): void {
    cansole.visibility = types.Visibility.Hidden;
}

/**
 * Toggles the visibility of the console.
 *
 * If `show` -> `hide` else `hide` -> `show`.
 */
function toggle(cansole: types.Cansole): void {
    if (cansole.visibility === types.Visibility.Visible) {
        hide(cansole);
    } else {
        show(cansole);
    }
}

/**
 * Renders the console.
 *
 * If `cansole.element` is `HTMLCanvasElement` then make sure that
 * `Cansoel.render` is called inside your game render loop (usually
 * `requestAnimationFrame`) so that `Cansole` is rendered at every frame
 * otherwise `Cansole` will be static and "non-reactive" and the inputs like
 * clicks, typing command in text input, dragging the windowa & etc won't work.
 *
 * Make sure that you call it at the very end of your game render loop so that
 * `Cansole` is rendered at the top of everything else rnedered on the
 * `HTMLCanvasElement`.
 */
function render(cansole: types.Cansole): void {
    if (utils.isCanvas(cansole.element)) {
        ui.canvas.render(cansole);
    } else {
        throw new Error(
            "Cansole.render: currently we can render to HTMLCanvasElement only" +
                " and the provided cansole.element is not HTMLCanvasElement."
        );
    }
}

export { create, hide, render, show, toggle };
