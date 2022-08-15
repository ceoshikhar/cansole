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
    const rect: shapes.rect.Rect = shapes.rect.create({
        x,
        y,
        w,
        h,
        bgColor: constants.BG_COLOR,
    });

    const canvas = cansole.element as HTMLCanvasElement;

    shapes.rect.makeDraggable(rect, canvas);

    rect.eventEmitter.on(
        events.Mouse.Dragging,
        function (msg: string, { deltaMovement }) {
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
