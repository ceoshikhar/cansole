import * as constants from "../../constants";
import * as types from "../../types";

import * as events from "./events";
import * as shapes from "./shapes";

type Button = {
    label: string;
    rect: shapes.rect.Rect;
};

type Options = {
    x?: number;
    y?: number;
    label: string;
    cansole: types.Cansole;
};

function create({ x = 0, y = 0, label, cansole }: Options): Button {
    // TODO: Calculate `w` and `h` from `label`.
    const rect = shapes.rect.create(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w: 200,
            h: 50,
            bgColor: constants.colors.primary,
            interactive: true
        }
    );

    rect.eventEmitter.on(events.Mouse.Click, function () {
        console.log("Clicked on Submit button!");
    });

    return {
        label,
        rect,
    };
}

function render(button: Button, ctx: CanvasRenderingContext2D): void {
    //
    // Draw button's rectangle.
    //

    shapes.rect.render(button.rect, ctx);

    //
    // Draw button's label.
    //

    const fontSize = "24px";
    const fontWeight = "normal";
    const fontFamily = "Perfect DOS VGA 437 Win";

    ctx.font = `${fontWeight} ${fontSize} '${fontFamily}'`;
    ctx.textAlign = "center";
    ctx.fillStyle = constants.colors.onPrimary;

    ctx.fillText(
        button.label,
        (button.rect.x + button.rect.w / 2),
        button.rect.b - 16
    );
}

export { Button, create, render };
