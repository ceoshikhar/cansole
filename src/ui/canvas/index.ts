import * as types from "../../types";
import * as utils from "../../utils";
import * as window from "./window";

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
        x: 100,
        y: 150,
        w: 300,
        h: 300,
        title: "Cansole",
        canvas: cansole.element,
    });

    cansole.window = myWindow;
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

    console.info("Rendering Cansole to a HTMLCanvasElement.");

    if (!cansole.window) {
      throw new Error(
          "ui.canvas.render: no cansole.window found, maybe you" +
          " forgot to run ui.canvas.setup."
      );
    }

    window.render(cansole.window, ctx);
}

export { render, setup, window };
