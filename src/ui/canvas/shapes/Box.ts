import { Vec2 } from "../../../math";
import { EventEmitter } from "../../../event-emitter";

import * as events from "../../../events";
import * as utils from "../../../utils";

import {
    Activable,
    ActiveEventCallback,
    ActiveLostEventCallback,
    Clickable,
    ClickEventCallback,
    Draggable,
    DragEventCallback,
    Hoverable,
    HoverEventCallback,
    HoverLostEventCallback,
    Drawable,
    Destroyable,
    Themeable,
} from "../interfaces";

type BoxOptions = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};

const defaultBoxOptions = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
} as const;

type BoxTheme = {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
};

type BoxThemeOptions = Partial<BoxTheme>;

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
        Destroyable,
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
        options: BoxOptions,
        theme: BoxThemeOptions = {}
    ) {
        this.canvas = canvas;
        this.theme = { ...defaultBoxTheme, ...theme };

        this.x = options.x || defaultBoxOptions.x;
        this.y = options.y || defaultBoxOptions.y;
        this.w = options.w || defaultBoxOptions.w;
        this.h = options.h || defaultBoxOptions.h;

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
        this.ee.on(events.MouseEvents.Hover, cb);
    }

    public onHoverLost(cb: HoverLostEventCallback<this>): void {
        this.ee.on(events.MouseEvents.HoverLost, cb);
    }

    public onActive(cb: ActiveEventCallback<this>): void {
        this.ee.on(events.MouseEvents.Active, cb);
    }

    public onActiveLost(cb: ActiveLostEventCallback<this>): void {
        this.ee.on(events.MouseEvents.ActiveLost, cb);
    }

    public onClick<T extends unknown = this>(cb: ClickEventCallback<T>): void {
        this.ee.on(events.MouseEvents.Click, cb);
    }

    public onDrag(cb: DragEventCallback<this>): void {
        this.ee.on(events.MouseEvents.Drag, cb);
    }

    public onDragEnd(cb: DragEventCallback<this>): void {
        this.ee.on(events.MouseEvents.DragEnd, cb);
    }

    public onDragStart(cb: DragEventCallback<this>): void {
        this.ee.on(events.MouseEvents.DragStart, cb);
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

    public setW(newW: number): void {
        this.w = newW;
        this.r = this.x + newW;
    }

    public setH(newH: number): void {
        this.h = newH;
        this.b = this.y + newH;
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

    public contains(coords: Vec2<number>): boolean {
        const x = coords.v1;
        const y = coords.v2;

        if (x >= this.l && x <= this.r && y >= this.t && y <= this.b) {
            return true;
        }

        return false;
    }

    public makeHoverable(): void {
        const onMouseMove = (event: MouseEvent) => {
            if (this.contains(new Vec2(event.offsetX, event.offsetY))) {
                if (!this.isHovered) {
                    this.isHovered = true;

                    this.ee.emit(events.MouseEvents.Hover, { target: this });
                }
            } else {
                if (this.isHovered) {
                    this.isHovered = false;

                    this.ee.emit(events.MouseEvents.HoverLost, {
                        target: this,
                    });
                }
            }
        };

        const onMouseLeave = () => {
            this.isHovered = false;
        };

        this.canvas.addEventListener("mousemove", onMouseMove);
        this.canvas.addEventListener("mouseleave", onMouseLeave);
        this.onDestroy(() =>
            this.canvas.removeEventListener("mousemove", onMouseMove)
        );
        this.onDestroy(() =>
            this.canvas.removeEventListener("mouseleave", onMouseLeave)
        );
    }

    public makeActivable(): void {
        const onMouseUp = () => {
            this.canvas.removeEventListener("mouseup", onMouseUp);

            if (this.isActive) {
                this.isActive = false;

                this.ee.emit(events.MouseEvents.ActiveLost, { target: this });
            }
        };

        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(new Vec2(event.offsetX, event.offsetY))) return;

            if (!this.isActive) {
                this.isActive = true;

                this.ee.emit(events.MouseEvents.Active, { target: this });
            }

            this.canvas.addEventListener("mouseup", onMouseUp);
            this.onDestroy(() =>
                this.canvas.removeEventListener("mouseup", onMouseUp)
            );
        };

        this.canvas.addEventListener("mousedown", onMouseDown);
        this.onDestroy(() =>
            this.canvas.removeEventListener("mousedown", onMouseDown)
        );
    }

    public makeClickable(): void {
        const onMouseUp = (event: MouseEvent) => {
            this.canvas.removeEventListener("mouseup", onMouseUp);

            if (!this.contains(new Vec2(event.offsetX, event.offsetY))) return;
            if (this.isDragging) return;

            this.ee.emit(events.MouseEvents.Click, { target: this });
        };

        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(new Vec2(event.offsetX, event.offsetY))) return;

            this.canvas.addEventListener("mouseup", onMouseUp);
            this.onDestroy(() =>
                this.canvas.removeEventListener("mouseup", onMouseUp)
            );
        };

        // The `mousedown` and `mouseup` should both happen inside the `box`
        // for it to be considered as a `events.mouse.Click`.
        this.canvas.addEventListener("mousedown", onMouseDown);
        this.onDestroy(() =>
            this.canvas.removeEventListener("mousedown", onMouseDown)
        );
    }

    public makeDraggable(): void {
        const onMouseDown = (event: MouseEvent) => {
            if (!this.contains(new Vec2(event.offsetX, event.offsetY))) return;

            const start = new Vec2(event.offsetX, event.offsetY);

            const onMouseMove = (event: MouseEvent) => {
                const end = new Vec2(event.offsetX, event.offsetX);
                const diff = end.sub(start);
                const delta = new Vec2(event.movementX, event.movementY);

                // Drag start?
                if (!this.isDragging) {
                    this.isDragging = true;

                    this.ee.emit(events.MouseEvents.DragStart, {
                        diff,
                        delta,
                        end,
                        start,
                        target: this,
                    });
                }

                this.ee.emit(events.MouseEvents.Drag, {
                    diff,
                    delta,
                    end,
                    start,
                    target: this,
                });
            };

            const onMouseUp = (event: MouseEvent) => {
                const end = new Vec2(event.offsetX, event.offsetX);
                const diff = end.sub(start);
                const delta = new Vec2(event.movementX, event.movementY);

                this.ee.emit(events.MouseEvents.DragEnd, {
                    diff,
                    delta,
                    end,
                    start,
                    target: this,
                });

                this.canvas.removeEventListener("mouseup", onMouseUp);
                this.canvas.removeEventListener("mousemove", onMouseMove);
                this.isDragging = false;
            };

            this.canvas.addEventListener("mousemove", onMouseMove);
            this.canvas.addEventListener("mouseup", onMouseUp);
            this.onDestroy(() =>
                this.canvas.removeEventListener("mousemove", onMouseMove)
            );
            this.onDestroy(() =>
                this.canvas.removeEventListener("mouseup", onMouseUp)
            );
        };

        this.canvas.addEventListener("mousedown", onMouseDown);
        this.onDestroy(() =>
            this.canvas.removeEventListener("mousedown", onMouseDown)
        );
    }

    public destroy(): void {
        console.log("Destroying Box");
        this.ee.emit(events.CoreEvents.Destroy);
    }

    private onDestroy(cb: () => void): void {
        this.ee.on(events.CoreEvents.Destroy, cb);
    }
}

export { Box };
