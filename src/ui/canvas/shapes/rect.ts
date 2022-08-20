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

    eventEmitter: eventEmitter.EventEmitter;

    isActive: boolean;
    isDragging: boolean;
    isHovered: boolean;
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

function create(
    canvas: HTMLCanvasElement,
    {
        x,
        y,
        w,
        h,
        bgColor = "#000",
        borderColor = null,
        borderRadius = 0,
    }: Options
): Rect {
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
        eventEmitter: eventEmitter.create(),
        isActive: false,
        isDragging: false,
        isHovered: false,
    };

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

function makeHoverable(rect: Rect, canvas: HTMLCanvasElement): void {
    canvas.addEventListener("mousemove", function (event) {
        if (contains(rect, math.vec2.create(event.x, event.y))) {
            if (!rect.isHovered) {
                rect.isHovered = true;

                rect.eventEmitter.emit(events.mouse.Hover);
            }
        } else {
            if (rect.isHovered) {
                rect.isHovered = false;

                rect.eventEmitter.emit(events.mouse.HoverLost);
            }
        }
    });

    canvas.addEventListener("mouseleave", function () {
        rect.isHovered = false;
    });
}

function makeClickable(rect: Rect, canvas: HTMLCanvasElement): void {
    // The `mousedown` and `mouseup` should both happen inside the `rect` for
    // it to be considered as a `events.mouse.Click`.
    canvas.addEventListener("mousedown", function (event) {
        if (!contains(rect, math.vec2.create(event.x, event.y))) return;

        if (!rect.isActive) {
            rect.isActive = true;

            rect.eventEmitter.emit(events.mouse.Active);
        }

        function handleMouseUp(event: MouseEvent) {
            canvas.removeEventListener("mouseup", handleMouseUp);

            if (rect.isActive) {
                rect.isActive = false;

                rect.eventEmitter.emit(events.mouse.ActiveLost);
            }

            if (!contains(rect, math.vec2.create(event.x, event.y))) return;
            if (rect.isDragging) return;

            rect.eventEmitter.emit(events.mouse.Click);
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

            rect.eventEmitter.emit(events.mouse.Drag, {
                deltaTotal,
                deltaMovement,
            });
        }

        function handleMouseUp() {
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
            rect.h - bw
        );
    }
}

export {
    Rect,
    contains,
    create,
    makeClickable,
    makeDraggable,
    makeHoverable,
    render,
    setB,
    setL,
    setR,
    setT,
    setX,
    setY
};
