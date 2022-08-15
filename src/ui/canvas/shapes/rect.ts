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

    isDragging: boolean;
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

function setPos(rect: Rect, pos: math.vec2.Vec2<number>): void {
    const newX = pos[0];
    const newY = pos[1];

    rect.x = newX;
    rect.y = newY;
    rect.l = newX;
    rect.t = newY;
    rect.r = newX + rect.w;
    rect.b = newY + rect.h;
}

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
        eventEmitter: eventEmitter.create(),
        isDragging: false,
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
    canvas.addEventListener("mousedown", function (event) {
        if (!contains(rect, math.vec2.create(event.x, event.y))) return;

        function handleMouseUp(event: MouseEvent) {
            canvas.removeEventListener("mouseup", handleMouseUp);

            if (!contains(rect, math.vec2.create(event.x, event.y))) return;
            if (rect.isDragging) return;

            rect.eventEmitter.emit(events.Mouse.Click, "Clicked");
        }

        canvas.addEventListener("mouseup", handleMouseUp);
    });
}

function makeDraggable(rect: Rect, canvas: HTMLCanvasElement): void {
    canvas.addEventListener("mousedown", function (event) {
        if (!contains(rect, math.vec2.create(event.x, event.y))) return;

        const start = math.vec2.create(event.x, event.y);

        function handleMouseMove(event: MouseEvent) {
            // Drag start?
            rect.isDragging = true;

            const curr = math.vec2.create(event.x, event.y);
            const deltaTotal = math.vec2.sub(curr, start);
            const deltaMovement = math.vec2.create(
                event.movementX,
                event.movementY
            );

            rect.eventEmitter.emit(events.Mouse.Dragging, "Dragging", {
                deltaTotal,
                deltaMovement,
            });
        }

        function handleMouseUp(event: MouseEvent) {
            // Drag end?
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            rect.isDragging = false;
        }

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
    });
}

function render(rect: Rect, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = rect.bgColor;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

export { Rect, contains, create, makeClickable, makeDraggable, render, setPos };
