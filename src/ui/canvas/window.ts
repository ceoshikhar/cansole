import * as constants from "../../constants";
import * as utils from "../../utils";
import * as types from "../../types";

import * as events from "./events";
import * as shapes from "./shapes";

type Window = {
    title: string;

    // Private
    rect: shapes.rect.Rect;
    titleBar: shapes.rect.Rect;
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
        }
    );

    const titleBar: shapes.rect.Rect = shapes.rect.create(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w,
            h: 30,
            bgColor: constants.colors.background2,
            interactive: true,
        }
    );

    titleBar.eventEmitter.on(events.Mouse.Drag, function ({ deltaMovement }) {
        console.log("Dragging Window");
        shapes.rect.setX(rect, rect.x + deltaMovement[0]);
        shapes.rect.setY(rect, rect.y + deltaMovement[1]);

        shapes.rect.setX(titleBar, titleBar.x + deltaMovement[0]);
        shapes.rect.setY(titleBar, titleBar.y + deltaMovement[1]);

        utils.positionButtonRelativeToWindow(cansole);
    });

    return {
        title,
        rect,
        titleBar,
    };
}

function render(window: Window, ctx: CanvasRenderingContext2D): void {
    shapes.rect.render(window.rect, ctx);
    shapes.rect.render(window.titleBar, ctx);
}

export { Window, create, render };
