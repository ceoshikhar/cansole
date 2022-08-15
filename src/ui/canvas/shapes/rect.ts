import * as events from "../events";
import * as eventEmitter from "../../../event-emitter";
import * as math from "../../../math";

type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;

    bgColor: string;
    borderColor: string | null;
    borderRadius: number;

    l: number;
    t: number;
    r: number;
    b: number;

    eventEmitter: eventEmitter.EventEmitter;
};

type Options = {
    x: number;
    y: number;
    w: number;
    h: number;

    bgColor?: string;
    // If `null`, skip rendering border.
    borderColor?: string | null;
    borderRadius?: number;
};

function create({
    x,
    y,
    w,
    h,
    bgColor = "#000",
    borderColor = null,
    borderRadius = 0,
}: Options): Rect {
    return {
        x,
        y,
        w,
        h,
        bgColor,
        borderColor,
        borderRadius,
        l: x,
        t: y,
        r: x + w,
        b: y + h,
        eventEmitter: eventEmitter.create()
    };
}

function contains(rect: Rect, coords: math.vec2.Vec2<number>): boolean {
    const x = coords[0];
    const y = coords[1];

    if (x >= rect.l && x <= rect.r && y >= rect.t && y <= rect.b) {
        return true;
    }

    return false;
}

function makeClickable(rect: Rect, canvas: HTMLCanvasElement): void {
    // The `mousedown` and `mouseup` should both happen inside the `rect` for
    // it to be considered as a `events.Mouse.Click`.
    canvas.addEventListener("mousedown", function(event) {
        if (!contains(rect, math.vec2.create(event.x, event.y))) return;

        canvas.addEventListener("mouseup", function cb(event) {
            canvas.removeEventListener("mouseup", cb);

            if (!contains(rect, math.vec2.create(event.x, event.y))) return;

            rect.eventEmitter.emit(events.Mouse.Click, 'LMAO');
        });
    });

}

function render(rect: Rect, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = rect.bgColor;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

export { Rect, contains, create, makeClickable, render };
