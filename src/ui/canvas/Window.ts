import * as constants from "../../constants";
import * as events from "../../events";
import { EventEmitter } from "../../event-emitter";

import { Button } from "./Button";
import { IDestroyable, IDraggable, DragEventCallback, IDrawable, IResizable, ResizeEventCallback } from "./interfaces";
import { Box } from "./Box";
import { Text } from "./Text";

type WindowOptions = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    minWidth?: number;
    minHeight?: number;
};

const defaultWindowOptions = {
    x: 0,
    y: 0,
    w: 640,
    h: 480,
    minWidth: 480,
    minHeight: 360,
} as const;

class Window implements IDestroyable, IDrawable, IDraggable, IResizable {
    public title: string;

    private canvas: HTMLCanvasElement;

    // TODO: rename `box` something else like `drawableArea` or `content`?
    private box: Box;
    private crossButton: Button;
    private resizer: Box;
    private titleBar: Box;

    private minWidth: number;
    private minHeight: number;

    private ee: EventEmitter;

    constructor(canvas: HTMLCanvasElement, title: string, options: WindowOptions) {
        this.title = title;

        this.canvas = canvas;

        const { x, y, w, h, minWidth, minHeight } = {
            ...defaultWindowOptions,
            ...options,
        };

        this.minWidth = minWidth;
        this.minHeight = minHeight;

        this.box = new Box(
            this.canvas,
            {
                x,
                y,
                w,
                h,
            },
            {
                backgroundColor: constants.colors.background,
            }
        );

        this.crossButton = new Button(
            this.canvas,
            "X",
            {
                x: x + w - 30,
                y,
                w: 30,
                h: 30,
            },
            {
                backgroundColor: constants.colors.error,

                hover: {
                    backgroundColor: constants.colors.errorHovered,
                },

                active: {
                    backgroundColor: constants.colors.error,
                },
            }
        );

        this.crossButton.setDisplayName("X");

        this.crossButton.onClick((e) => {
            this.ee.emit(events.WindowEvents.Close, this);
            this.destroy();
        });

        this.titleBar = new Box(
            this.canvas,
            {
                x,
                y,
                w: w - 30,
                h: 30,
            },
            {
                backgroundColor: constants.colors.background2,
            }
        );

        // TODO: Make a new type called `Resizer`?
        this.resizer = new Box(
            this.canvas,
            {
                x: x + w - 10,
                y: y + h - 10,
                w: 10,
                h: 10,
            },
            {
                backgroundColor: constants.colors.secondary,
            }
        );

        this.ee = new EventEmitter();

        this.makeDraggable();
        this.makeResizable();
    }

    public get x(): number {
        return this.box.x;
    }

    public get y(): number {
        return this.box.y;
    }

    public get w(): number {
        return this.box.w;
    }

    public get h(): number {
        return this.box.h;
    }

    public get l(): number {
        return this.box.l;
    }

    public get t(): number {
        return this.box.t;
    }

    public get r(): number {
        return this.box.r;
    }

    public get b(): number {
        return this.box.b;
    }
    public setX(newX: number): void {
        this.box.setX(newX);
    }

    public setY(newY: number): void {
        this.box.setY(newY);
    }

    public setL(newL: number): void {
        this.box.setL(newL);
    }

    public setT(newT: number): void {
        this.box.setT(newT);
    }

    public setR(newR: number): void {
        this.box.setR(newR);
    }

    public setB(newB: number): void {
        this.box.setB(newB);
    }

    private makeDraggable(): void {
        this.titleBar.makeDraggable();

        this.titleBar.onDrag((e) => {
            const { delta } = e;
            const dx = delta.v1;
            const dy = delta.v2;

            this.box.setX(this.box.x + dx);
            this.box.setY(this.box.y + dy);

            this.crossButton.setX(this.crossButton.x + dx);
            this.crossButton.setY(this.crossButton.y + dy);

            this.resizer.setX(this.resizer.x + dx);
            this.resizer.setY(this.resizer.y + dy);

            this.titleBar.setX(this.titleBar.x + dx);
            this.titleBar.setY(this.titleBar.y + dy);
        });

        this.titleBar.onDrag((e) => {
            const { target, ...rest } = e;
            this.ee.emit(events.MouseEvents.Drag, { target: this, ...rest });
        });

        this.titleBar.onDragEnd((e) => {
            const { target, ...rest } = e;
            this.ee.emit(events.MouseEvents.DragEnd, { target: this, ...rest });
        });

        this.titleBar.onDragStart((e) => {
            const { target, ...rest } = e;
            this.ee.emit(events.MouseEvents.DragStart, {
                target: this,
                ...rest,
            });
        });
    }

    public onClose(cb: (window: Window) => void): void {
        this.ee.on(events.WindowEvents.Close, cb);
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

    private makeResizable(): void {
        this.resizer.makeActivable();
        this.resizer.makeDraggable();
        this.resizer.makeHoverable();

        this.resizer.onHover(() => {
            this.canvas.style.cursor = "se-resize";
        });

        this.resizer.onHoverLost(() => {
            this.canvas.style.cursor = "auto";
        });

        this.resizer.onDragEnd(() => {
            this.ee.emit(events.WindowEvents.ResizeEnd, { target: this.box });
        });

        this.resizer.onDragStart(() => {
            this.ee.emit(events.WindowEvents.ResizeStart, { target: this });
        });

        this.resizer.onDrag((e) => {
            this.ee.emit(events.WindowEvents.Resize, { target: this });

            const { delta } = e;
            const dx = delta.v1;
            const dy = delta.v2;

            const newWidth = this.box.w + dx;
            const newHeight = this.box.h + dy;

            if (newWidth >= this.minWidth && newHeight >= this.minHeight) {
                // Resize the box's width and height.
                this.box.setW(newWidth);
                this.box.setH(newHeight);

                // Keep the crossButton at the top right.
                this.crossButton.setX(this.crossButton.x + dx);

                // Resize the title bar's width.
                this.titleBar.setW(this.titleBar.w + dx);

                // Keep the resize at the bottom right.
                this.resizer.setX(this.resizer.x + dx);
                this.resizer.setY(this.resizer.y + dy);
            }
        });
    }

    public onResize(cb: ResizeEventCallback<this>): void {
        this.ee.on(events.WindowEvents.Resize, cb);
    }

    public onResizeEnd(cb: ResizeEventCallback<this>): void {
        this.ee.on(events.WindowEvents.ResizeEnd, cb);
    }

    public onResizeStart(cb: ResizeEventCallback<this>): void {
        this.ee.on(events.WindowEvents.ResizeStart, cb);
    }

    public draw(): void {
        // Draw the entire window.
        this.box.draw();

        // Draw the title bar's close button.
        this.crossButton.draw();

        // Draw the window's resizer.
        this.resizer.draw();

        // Draw the window's title bar.
        this.titleBar.draw();

        // Draw the window' title on the `titleBar`.
        new Text(
            this.canvas,
            this.title,
            {
                x: this.titleBar.x + this.box.w / 2,
                y: this.titleBar.y + this.titleBar.h / 2,
            },
            {
                foregroundColor: constants.colors.onPrimary,
                textAlign: "center",
                textBaseline: "middle",
            }
        ).draw();
    }

    public destroy(): void {
        this.box.destroy();
        this.titleBar.destroy();
        this.crossButton.destroy();
    }
}

export { Window };
