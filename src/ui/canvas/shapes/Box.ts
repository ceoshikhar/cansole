import * as math from "../../../math";
import { EventEmitter } from "../../../event-emitter";

import * as events from "../events";
import * as utils from "../utils";

import {
    Activable,
    ActiveEventCallback,
    ActiveLostEventCallback,
} from "../interfaces/Activable";
import { Clickable, ClickEventCallback } from "../interfaces/Clickable";
import { Draggable, DragEventCallback } from "../interfaces/Draggable";
import {
    Hoverable,
    HoverEventCallback,
    HoverLostEventCallback,
} from "../interfaces/Hoverable";
import { Drawable } from "../interfaces/Drawable";
import { Themeable } from "../interfaces/Themeable";

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
};

const defaultBoxOptions: BoxOptions = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
};

const defaultBoxTheme: BoxTheme = {
    backgroundColor: "#EFEFEF",
    // No border by default.
    borderColor: "",
    borderWidth: 0,
};

class Box
    implements
        Activable<Box>,
        Clickable<Box>,
        Draggable<Box>,
        Drawable,
        Hoverable<Box>,
        Themeable<BoxTheme>
{
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    public l: number;
    public t: number;
    public r: number;
    public b: number;

    public theme: BoxTheme;

    public isActive: boolean;
    public isDragging: boolean;
    public isHovered: boolean;

    private canvas: HTMLCanvasElement;

    private ee: EventEmitter;

    constructor(
        canvas: HTMLCanvasElement,
        options: BoxOptions = defaultBoxOptions,
        theme: Partial<BoxTheme> = {}
    ) {
        this.canvas = canvas;
        this.theme = { ...defaultBoxTheme, ...theme };

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

        // Draw a border if we have a `borderColor` & `borderWidth`.
        if (this.theme.borderColor && this.theme.borderWidth) {
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

    public onActive(cb: ActiveEventCallback<this>): void {
        this.ee.on(events.mouse.Active, cb);
    }

    public onActiveLost(cb: ActiveLostEventCallback<this>): void {
        this.ee.on(events.mouse.ActiveLost, cb);
    }

    public onClick<T extends unknown = this>(cb: ClickEventCallback<T>): void {
        this.ee.on(events.mouse.Click, cb);
    }

    public onDrag(cb: DragEventCallback<this>): void {
        this.ee.on(events.mouse.Drag, cb);
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
            if (this.contains(math.vec2.create(event.offsetX, event.offsetY))) {
                if (!this.isHovered) {
                    this.isHovered = true;

                    this.ee.emit(events.mouse.Hover, { target: this });
                }
            } else {
                if (this.isHovered) {
                    this.isHovered = false;

                    this.ee.emit(events.mouse.HoverLost, { target: this });
                }
            }
        };

        this.canvas.addEventListener("mousemove", onMouseMove);

        const onMouseLeave = () => {
            this.isHovered = false;
        };

        this.canvas.addEventListener("mouseleave", onMouseLeave);
    }

    public makeActivable(): void {
        const onMouseUp = () => {
            this.canvas.removeEventListener("mouseup", onMouseUp);

            if (this.isActive) {
                this.isActive = false;

                this.ee.emit(events.mouse.ActiveLost, { target: this });
            }
        };

        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(math.vec2.create(event.offsetX, event.offsetY)))
                return;

            if (!this.isActive) {
                this.isActive = true;

                this.ee.emit(events.mouse.Active, { target: this });
            }

            this.canvas.addEventListener("mouseup", onMouseUp);
        };

        this.canvas.addEventListener("mousedown", onMouseDown);
    }

    public makeClickable(): void {
        const handleMouseUp = (event: MouseEvent) => {
            this.canvas.removeEventListener("mouseup", handleMouseUp);

            if (!this.contains(math.vec2.create(event.offsetX, event.offsetY)))
                return;
            if (this.isDragging) return;

            this.ee.emit(events.mouse.Click, { target: this });
        };

        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(math.vec2.create(event.offsetX, event.offsetY)))
                return;

            this.canvas.addEventListener("mouseup", handleMouseUp);
        };

        // The `mousedown` and `mouseup` should both happen inside the `box`
        // for it to be considered as a `events.mouse.Click`.
        this.canvas.addEventListener("mousedown", onMouseDown);
    }

    public makeDraggable(): void {
        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(math.vec2.create(event.offsetX, event.offsetY)))
                return;

            const start = math.vec2.create(event.offsetX, event.offsetY);

            const onMouseMove = (event: MouseEvent) => {
                // Drag start?
                this.isDragging = true;

                const curr = math.vec2.create(event.offsetX, event.offsetX);
                const deltaTotal = math.vec2.sub(curr, start);
                const deltaMovement = math.vec2.create(
                    event.movementX,
                    event.movementY
                );

                this.ee.emit(events.mouse.Drag, {
                    target: this,
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

export { Box, BoxTheme, defaultBoxTheme };
