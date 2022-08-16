import * as constants from "../../constants";
import * as utils from "../../utils";
import * as types from "../../types";

import * as events from "./events";
import * as shapes from "./shapes";

type Window = {
    rect: shapes.rect.Rect;
    title: string;
};

type Options = {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    cansole: types.Cansole;
};

function create({ x, y, w, h, title, cansole }: Options): Window {
    const rect: shapes.rect.Rect = shapes.rect.create(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w,
            h,
            bgColor: constants.colors.background,
            interactive: true
        }
    );

    rect.eventEmitter.on(
        events.Mouse.Dragging,
        function ({ deltaMovement }) {
            console.log("Dragging Window");
            shapes.rect.setX(rect, rect.x + deltaMovement[0]);
            shapes.rect.setY(rect, rect.y + deltaMovement[1]);

            utils.positionButtonRelativeToWindow(cansole);
        }
    );

    return {
        rect,
        title,
    };
}

function render(window: Window, ctx: CanvasRenderingContext2D): void {
    shapes.rect.render(window.rect, ctx);
}

export { Window, create, render };
