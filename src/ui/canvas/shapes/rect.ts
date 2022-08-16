import * as eventEmitter from "../../../event-emitter";
import * as math from "../../../math";
import * as events from "../events";

type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;

    // TODO: instead of these being atom data why not have a `Theme` object?
    bgColor: string;
    borderColor: string | null;
    borderRadius: number;

    l: number;
    t: number;
    r: number;
    b: number;

    interactive: boolean;
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

    interactive?: boolean;
};

function create(canvas: HTMLCanvasElement, {
    x,
    y,
    w,
    h,
    bgColor = "#000",
    borderColor = null,
    borderRadius = 0,
    interactive = false,
}: Options): Rect {
    const rect: Rect = {
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
        interactive,
        eventEmitter: eventEmitter.create(),
        isDragging: false,
    };


    makeClickable(rect, canvas);
    makeDraggable(rect, canvas);

    return rect;
}

function setX(rect: Rect, newX: number): void {
    rect.x = newX;
    rect.l = newX;
    rect.r = newX + rect.w;
}

function setY(rect: Rect, newY: number): void {
    rect.y = newY;
    rect.t = newY;
    rect.b = newY + rect.h;
}

function setL(rect: Rect, newL: number): void {
    const newR = newL + rect.w;

    rect.l = newL;
    rect.x = newL;
    rect.r = newR;
}

function setT(rect: Rect, newT: number): void {
    const newB = newT + rect.h;

    rect.t = newT;
    rect.y = newT;
    rect.b = newB;
}

function setR(rect: Rect, newR: number): void {
    const newX = newR - rect.w;

    rect.r = newR;
    rect.x = newX;
    rect.l = newX;
}

function setB(rect: Rect, newB: number): void {
    const newY = newB - rect.h;

    rect.b = newB;
    rect.y = newY;
    rect.t = newY;
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

            if (rect.interactive) {
                rect.eventEmitter.emit(events.Mouse.Click);
            }
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

            if (rect.interactive) {
                rect.eventEmitter.emit(events.Mouse.Dragging, {
                    deltaTotal,
                    deltaMovement,
                });
            }
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
    // Draw the rectangle shape.
    ctx.fillStyle = rect.bgColor;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    // Draw a border if we have a `borderColor`.
    if (rect.borderColor !== null) {
        // Border's width.
        const bw = 10; // TODO: This could be a part of a "button.Theme"?
        ctx.lineWidth = bw;
        ctx.strokeStyle = rect.borderColor;

        ctx.strokeRect(
            rect.x + bw / 2,
            rect.y + bw / 2,
            rect.w - bw,
            rect.h - bw,
        );
    }
}

export {
    Rect,
    contains,
    create,
    render,
    setB,
    setL,
    setR,
    setT,
    setX,
    setY,
};
