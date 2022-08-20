import * as eventEmitter from "../../../event-emitter";
import * as math from "../../../math";

import * as events from "../events";
import * as utils from "../utils";

import { Drawable } from "../drawable";
import { Clickable, ClickEventCallback } from "../clickable";

type BoxOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
};

type BoxTheme = {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    foregroundColor: string;
};

const DEFAULT_BOX_OPTIONS: BoxOptions = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
}

const DEFAULT_BOX_THEME: BoxTheme = {
    backgroundColor: "#000000",
    borderWidth: 10,
    borderColor: "",
    foregroundColor: "#ffffff",
}

class Box implements Clickable<Box>, Drawable {
    canvas: HTMLCanvasElement;

    options: BoxOptions;

    theme: BoxTheme;

    constructor(
        canvas: HTMLCanvasElement,
        options: BoxOptions = DEFAULT_BOX_OPTIONS,
        theme: Partial<BoxTheme> = {},
    ) {
        this.canvas = canvas;
        this.options = options;
        this.theme = { ...DEFAULT_BOX_THEME, ...theme };
    }

    public draw(): void {
        const ctx = utils.getContext2D(this.canvas);

        // Draw the rectangle shape.
        ctx.fillStyle = this.theme.backgroundColor;
        ctx.fillRect(this.options.x, this.options.y, this.options.w, this.options.h);

        // Draw a border if we have a `borderColor`.
        if (this.theme.borderColor !== null) {
            const bw = this.theme.borderWidth;

            ctx.lineWidth = bw;
            ctx.strokeStyle = this.theme.borderColor;

            ctx.strokeRect(
                this.options.x + bw / 2,
                this.options.y + bw / 2,
                this.options.w - bw,
                this.options.h - bw
            );
        }
    }

    public onClick(cb: ClickEventCallback<this>): void {}
}

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
    setY,
};
