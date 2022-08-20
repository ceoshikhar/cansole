import * as math from "../../../math";
import { EventEmitter } from "../../../event-emitter";

import * as events from "../events";
import * as utils from "../utils";

import { Clickable, ClickEventCallback } from "../interfaces/Clickable";
import {
    Hoverable,
    HoverEventCallback,
    HoverLostEventCallback
} from "../interfaces/Hoverable";
import { Drawable } from "../interfaces/Drawable";

type BoxOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
};

type BoxTheme = {
    backgroundColor: string;
    foregroundColor: string;
    borderColor: string;
    borderWidth: number;
};

const DEFAULT_BOX_OPTIONS: BoxOptions = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
};

const DEFAULT_BOX_THEME: BoxTheme = {
    backgroundColor: "#000000",
    foregroundColor: "#ffffff",
    borderColor: "", // Empty string so that no border is drawn.
    borderWidth: 10,
};

class Box implements Clickable<Box>, Drawable, Hoverable<Box> {
    private canvas: HTMLCanvasElement;
    public theme: BoxTheme;

    public x: number;
    public y: number;
    public w: number;
    public h: number;

    public l: number;
    public t: number;
    public r: number;
    public b: number;

    public ee: EventEmitter;
    public isActive: boolean;
    public isDragging: boolean;
    public isHovered: boolean;

    constructor(
        canvas: HTMLCanvasElement,
        options: BoxOptions = DEFAULT_BOX_OPTIONS,
        theme: Partial<BoxTheme> = {}
    ) {
        this.canvas = canvas;
        this.theme = { ...DEFAULT_BOX_THEME, ...theme };

        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;

        this.l = this.x;
        this.t = this.y;
        this.r = this.x + this.w;
        this.b = this.y + this.h;

        this.ee = new EventEmitter();
        this.isActive = false;
        this.isDragging = false;
        this.isHovered = false;
    }

    public draw(): void {
        const ctx = utils.getContext2D(this.canvas);

        // Draw the rectangle shape.
        ctx.fillStyle = this.theme.backgroundColor;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw a border if we have a `borderColor`.
        if (this.theme.borderColor) {
            const bw = this.theme.borderWidth;

            ctx.lineWidth = bw;
            ctx.strokeStyle = this.theme.borderColor;

            ctx.strokeRect(
                this.x + bw / 2,
                this.y + bw / 2,
                this.w - bw,
                this.h - bw
            );
        }
    }

    public onHover(cb: HoverEventCallback<this>): void {
        this.ee.on(events.mouse.Hover, cb);
    }

    public onHoverLost(cb: HoverLostEventCallback<this>): void {
        this.ee.on(events.mouse.HoverLost, cb);
    }

    public onClick(cb: ClickEventCallback<this>): void {
        this.ee.on(events.mouse.Click, cb);
    }

    public setX(newX: number): void {
        this.x = newX;
        this.l = newX;
        this.r = newX + this.w;
    }

    public setY(newY: number): void {
        this.y = newY;
        this.t = newY;
        this.b = newY + this.h;
    }

    public setL(newL: number): void {
        const newR = newL + this.w;

        this.l = newL;
        this.x = newL;
        this.r = newR;
    }

    public setT(newT: number): void {
        const newB = newT + this.h;

        this.t = newT;
        this.y = newT;
        this.b = newB;
    }

    public setR(newR: number): void {
        const newX = newR - this.w;

        this.r = newR;
        this.x = newX;
        this.l = newX;
    }

    public setB(newB: number): void {
        const newY = newB - this.h;

        this.b = newB;
        this.y = newY;
        this.t = newY;
    }

    public contains(coords: math.vec2.Vec2<number>): boolean {
        const x = coords[0];
        const y = coords[1];

        if (x >= this.l && x <= this.r && y >= this.t && y <= this.b) {
            return true;
        }

        return false;
    }

    public makeHoverable(): void {
        const onMouseMove = (event: MouseEvent) => {
            if (this.contains(math.vec2.create(event.x, event.y))) {
                if (!this.isHovered) {
                    this.isHovered = true;

                    this.ee.emit(events.mouse.Hover);
                }
            } else {
                if (this.isHovered) {
                    this.isHovered = false;

                    this.ee.emit(events.mouse.HoverLost);
                }
            }
        };
        this.canvas.addEventListener("mousemove", onMouseMove);

        const onMouseLeave = () => {
            this.isHovered = false;
        };

        this.canvas.addEventListener("mouseleave", onMouseLeave);
    }

    public makeClickable(): void {
        const handleMouseUp = (event: MouseEvent) => {
            this.canvas.removeEventListener("mouseup", handleMouseUp);

            if (this.isActive) {
                this.isActive = false;

                this.ee.emit(events.mouse.ActiveLost);
            }

            if (!this.contains(math.vec2.create(event.x, event.y))) return;
            if (this.isDragging) return;

            this.ee.emit(events.mouse.Click);
        };

        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(math.vec2.create(event.x, event.y))) return;

            if (!this.isActive) {
                this.isActive = true;

                this.ee.emit(events.mouse.Active);
            }

            this.canvas.addEventListener("mouseup", handleMouseUp);
        };

        // The `mousedown` and `mouseup` should both happen inside the `box`
        // for it to be considered as a `events.mouse.Click`.
        this.canvas.addEventListener("mousedown", onMouseDown);
    }

    public makeDraggable(): void {
        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(math.vec2.create(event.x, event.y))) return;

            const start = math.vec2.create(event.x, event.y);

            const onMouseMove = (event: MouseEvent) => {
                // Drag start?
                this.isDragging = true;

                const curr = math.vec2.create(event.x, event.y);
                const deltaTotal = math.vec2.sub(curr, start);
                const deltaMovement = math.vec2.create(
                    event.movementX,
                    event.movementY
                );

                this.ee.emit(events.mouse.Drag, {
                    deltaTotal,
                    deltaMovement,
                });
            };

            const onMouseUp = () => {
                // Drag end?
                this.canvas.removeEventListener("mouseup", onMouseUp);
                this.canvas.removeEventListener("mousemove", onMouseMove);
                this.isDragging = false;
            };

            this.canvas.addEventListener("mousemove", onMouseMove);
            this.canvas.addEventListener("mouseup", onMouseUp);
        };

        this.canvas.addEventListener("mousedown", onMouseDown);
    }
}

export { Box };
