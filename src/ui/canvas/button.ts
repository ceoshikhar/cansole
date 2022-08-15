import * as types from "../../types";

import * as events from "./events";
import * as shapes from "./shapes";

type Button = {
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
    const rect = shapes.rect.create({ x, y, w: 200, h: 50, bgColor: "red" });

    const canvas = cansole.element as HTMLCanvasElement;

    shapes.rect.makeClickable(rect, canvas);

    rect.eventEmitter.on(events.Mouse.Click, function () {
        console.log("Clicked on button");
    });

    return {
        rect,
    };
}

function render(button: Button, ctx: CanvasRenderingContext2D): void {
    shapes.rect.render(button.rect, ctx);
}

export { Button, create, render };
