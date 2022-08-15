import * as types from "../../types";
import * as utils from "../../utils";
import * as window from "./window";

/**
 * Render a `Cansole` to a `HTMLCanvasElement`.
 */
function render(cansole: types.Cansole) {
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

    const myWindow = window.create(10, 10, 200, 300, "Cansole");
    window.render(myWindow, ctx);
}

export { render };
