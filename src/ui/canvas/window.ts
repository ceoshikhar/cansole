import * as constants from "../../constants";
import * as events from "./events";
import * as shapes from "./shapes";
import * as math from "../../math";

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
    const myRect: shapes.rect.Rect = shapes.rect.create({
        x,
        y,
        w,
        h,
        bgColor: constants.BG_COLOR,
    });

    shapes.rect.makeClickable(myRect, canvas);

    shapes.rect.makeDraggable(myRect, canvas);

    myRect.eventEmitter.on(events.Mouse.Click, function (msg: string) {
        console.log("event.Mouse.Click", { msg });
    });

    myRect.eventEmitter.on(
        events.Mouse.Dragging,
        function (msg: string, { deltaMovement }) {
            x += deltaMovement[0];
            y += deltaMovement[1];

            shapes.rect.setPos(myRect, math.vec2.create(x, y));
        }
    );

    return {
        rect: myRect,
        title,
    };
}

function render(window: Window, ctx: CanvasRenderingContext2D): void {
    shapes.rect.render(window.rect, ctx);
}

export { Window, create, render };
