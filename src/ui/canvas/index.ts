import * as types from "../../types";
import * as utils from "../../utils";

import * as button from "./button";
import * as window from "./window";

import * as shapes from "./shapes";

/**
 * Setup a `Cansole` so that it can be rendered to a `HTMLCanvasElement`.
 */
function setup(cansole: types.Cansole): void {
    if (!utils.isCanvas(cansole.element)) {
        throw new Error(
            "UI.canvas.setup: cansole.element is not an HTMLCanvasElement."
        );
    }

    const myWindow = window.create({
        x: 150,
        y: 150,
        w: 300,
        h: 300,
        title: "Cansole",
        cansole,
    });

    cansole.window = myWindow;

    const myButton = button.create({
        label: "Submit",
        cansole,
    });

    cansole.button = myButton;

    utils.positionButtonRelativeToWindow(cansole);
}

/**
 * Render a `Cansole` to a `HTMLCanvasElement`.
 */
function render(cansole: types.Cansole): void {
    if (!utils.isCanvas(cansole.element)) {
        throw new Error(
            "UI.canvas.render: cansole.element is not an HTMLCanvasElement."
        );
    }

    const ctx = cansole.element.getContext("2d");

    if (ctx === null) {
        throw new Error(
            "UI.canvas.render: failed to get CanvasRenderingContext2D from" +
                " cansole.element."
        );
    }

    // Cansole is hidden, so don't render anything.
    if (cansole.visibility === types.Visibility.Hidden) {
        return;
    }

    if (!cansole.window) {
        throw new Error(
            "ui.canvas.render: no cansole.window found, maybe you" +
                " forgot to run ui.canvas.setup."
        );
    }

    if (!cansole.button) {
        throw new Error(
            "ui.canvas.render: no cansole.button found, maybe you" +
                " forgot to run ui.canvas.setup."
        );
    }

    //
    // Start drawing.
    //

    window.render(cansole.window, ctx);
    button.render(cansole.button, ctx);
}

export { render, setup, shapes, window, button };
