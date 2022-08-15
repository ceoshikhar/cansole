import * as constants from "../../constants";
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
    canvas: HTMLCanvasElement;
};

function create({ x, y, w, h, title, canvas }: Options): Window {
    const rect: shapes.rect.Rect = shapes.rect.create({
        x,
        y,
        w,
        h,
        bgColor: constants.BG_COLOR,
    });

    shapes.rect.makeClickable(rect, canvas);

    rect.eventEmitter.on(events.Mouse.Click, function(msg: string) {
        console.log("event.Mouse.Click", { msg });
    });

    return {
        rect,
        title,
    };
}

function render(window: Window, ctx: CanvasRenderingContext2D) {
    shapes.rect.render(window.rect, ctx);
}

export { Window, create, render };
