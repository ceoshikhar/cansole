import * as Constants from "../constants";
import * as Types from "../types";
import * as Utils from "../utils";

type Context = CanvasRenderingContext2D;

function renderWindow(cansole: Types.Cansole, ctx: Context) {
    ctx.fillStyle = Constants.BG_COLOR;
    ctx.fillRect(10, 10, 150, 100);
}

function render(cansole: Types.Cansole) {
    if (!Utils.isCanvas(cansole.element)) {
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
    if (cansole.visibility === Types.Visibility.Hidden) {
        return;
    }

    console.info("Rendering Cansole to a HTMLCanvasElement.");

    renderWindow(cansole, ctx);
}

export { render };
