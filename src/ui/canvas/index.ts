import { Cansole, Visibility } from "../../Cansole";
import * as utils from "../../utils";

import { Button } from "./Button";
import * as window from "./window";

type Renderables = {
    window: window.Window;
    submitButton: Button;
};

/**
 * Setup a `Cansole` so that it can be rendered to a `HTMLCanvasElement`.
 */
function setup(cansole: Cansole): void {
    if (!utils.isCanvas(cansole.element)) {
        throw new Error(
            "UI.canvas.setup: cansole.element is not an HTMLCanvasElement."
        );
    }

    const myWindow = window.create({
        x: 150,
        y: 150,
        w: 640,
        h: 480,
        title: "Cansole",
        cansole,
    });

    const submitButton = new Button(
        cansole.element as HTMLCanvasElement,
        "Submit"
    );

    submitButton.onClick(() => {
        console.log("Clicked on Submit");
    });

    cansole.canvasRenderables = {
        window: myWindow,
        submitButton,
    };

    cansole.onHide(() => destroy(cansole));

    utils.positionButtonRelativeToWindow(cansole);
}

/**
 * Render a `Cansole` to a `HTMLCanvasElement`.
 */
function render(cansole: Cansole): void {
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
    if (cansole.visibility === Visibility.Hidden) {
        return;
    }

    const renderables = cansole.canvasRenderables;

    if (!renderables) {
        throw new Error(
            "ui.canvas.render: no cansole.canvasRenderables found, maybe you" +
                " forgot to run ui.canvas.setup."
        );
    }

    //
    // Start drawing.
    //

    window.render(renderables.window);
    renderables.submitButton.draw();
}

function destroy(cansole: Cansole): void {
    const renderables = cansole.canvasRenderables;

    if (!renderables) {
        throw new Error(
            "ui.canvas.render: no cansole.canvasRenderables found, maybe you" +
                " forgot to run ui.canvas.setup."
        );
    }

    console.log("Destroying CanvasUI");

    window.destroy(renderables.window);
    renderables.submitButton.destroy();
}

export { Renderables, render, setup, window };
