import { Cansole, Visibility } from "../../Cansole";
import * as utils from "../../utils";

import { Button } from "./Button";
import { Drawable } from "./interfaces/Drawable";
import { Destroyable } from "./interfaces/Destroyable";
import { Window } from "./Window";

/**
 * Setup a `Cansole` so that it can be rendered to a `HTMLCanvasElement`.
 */
function setup(cansole: Cansole): void {
    if (!utils.isCanvas(cansole.element)) {
        throw new Error(
            "UI.canvas.setup: cansole.element is not an HTMLCanvasElement."
        );
    }

    const myWindow = new Window({
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

    cansole.canvasItems.push(myWindow);
    cansole.canvasItems.push(submitButton);

    cansole.onHide(() => destroy(cansole));

    utils.positionButtonRelativeToWindow(submitButton, myWindow);

    myWindow.onDrag(() =>
        utils.positionButtonRelativeToWindow(submitButton, myWindow)
    );
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

    //
    // Start drawing.
    //

    cansole.canvasItems.forEach((item) => item.draw());
}

function destroy(cansole: Cansole): void {
    console.log("Destroying CanvasUI");
    cansole.canvasItems.forEach((item) => item.destroy());
}

export { Button, Destroyable, Drawable, render, setup, Window };
