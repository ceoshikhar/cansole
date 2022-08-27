import * as constants from "../../constants";
import * as events from "../../events";
import * as utils from "../../utils";
import { EventEmitter } from "../../event-emitter";
import { Cansole } from "../../Cansole";

import { Destroyable } from "./interfaces/Destroyable";
import { Drawable } from "./interfaces/Drawable";
import { Draggable, DragEventCallback } from "./interfaces/Draggable";
import { Box } from "./shapes/Box";
import { Button } from "./Button";
import { Resizable, ResizeEventCallback } from "./interfaces/Resizable";

type WindowOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    cansole: Cansole;
};

class Window implements Destroyable, Drawable, Draggable, Resizable {
    public title: string;

    private canvas: HTMLCanvasElement;

    // TODO: rename `box` something else like "drawableArea"?
    private box: Box;
    private crossButton: Button;
    private resizer: Box;
    private titleBar: Box;

    private ee: EventEmitter;

    constructor({ x, y, w, h, title, cansole }: WindowOptions) {
        this.canvas = cansole.element as HTMLCanvasElement;

        const box: Box = new Box(
            cansole.element as HTMLCanvasElement,
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

        const crossButton: Button = new Button(
            cansole.element as HTMLCanvasElement,
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

        crossButton.onClick(() => {
            console.log("Clicked on X");
            cansole.hide();
        });

        const titleBar: Box = new Box(
            cansole.element as HTMLCanvasElement,
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
        const resizer: Box = new Box(
            cansole.element as HTMLCanvasElement,
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

        this.title = title;
        this.box = box;
        this.crossButton = crossButton;
        this.resizer = resizer;
        this.titleBar = titleBar;

        this.ee = new EventEmitter();

        this.makeDraggable();
        this.makeResizable(cansole);

        cansole.onHide(() => this.destroy());
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
            console.log("Dragging window");
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

    public onDrag(cb: DragEventCallback<this>): void {
        this.ee.on(events.MouseEvents.Drag, cb);
    }

    public onDragEnd(cb: DragEventCallback<this>): void {
        this.ee.on(events.MouseEvents.DragEnd, cb);
    }

    public onDragStart(cb: DragEventCallback<this>): void {
        this.ee.on(events.MouseEvents.DragStart, cb);
    }

    private makeResizable(cansole: Cansole): void {
        this.resizer.makeActivable();
        this.resizer.makeDraggable();
        this.resizer.makeHoverable();

        this.resizer.onHover(() => {
            cansole.element.style.cursor = "se-resize";
        });

        this.resizer.onHoverLost(() => {
            cansole.element.style.cursor = "auto";
        });

        this.resizer.onDragEnd((e) => {
            console.log("Resizing window end");
            this.ee.emit(events.WindowEvents.ResizeEnd, { target: this.box });
        });

        this.resizer.onDragStart((e) => {
            console.log("Resizing window start");
            this.ee.emit(events.WindowEvents.ResizeStart, { target: this });
        });

        this.resizer.onDrag((e) => {
            console.log("Resizing window");

            this.ee.emit(events.WindowEvents.Resize, { target: this });

            const { delta } = e;
            const dx = delta.v1;
            const dy = delta.v2;

            // Resize the box's width and height.
            this.box.setW(this.box.w + dx);
            this.box.setH(this.box.h + dy);

            // Keep the crossButton at the top right.
            this.crossButton.setX(this.crossButton.x + dx);

            // Reisze the title bar's width.
            this.titleBar.setW(this.titleBar.w + dx);

            // Keep the resize at the bottom right.
            this.resizer.setX(this.resizer.x + dx);
            this.resizer.setY(this.resizer.y + dy);
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
        const fontSize = 18;
        const fontSizePx = `${fontSize}px`;
        const fontWeight = "normal";
        const fontFamily = "Perfect DOS VGA 437 Win";

        const ctx = utils.getContext2D(this.canvas);

        // TODO: Make a new type called "Text".
        ctx.font = `${fontWeight} ${fontSizePx} '${fontFamily}'`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = constants.colors.onPrimary;

        ctx.fillText(
            this.title,
            this.titleBar.x + this.box.w / 2,
            this.titleBar.y + this.titleBar.h / 2
        );
    }

    public destroy(): void {
        console.log("Destroying Window");

        this.box.destroy();
        this.titleBar.destroy();
        this.crossButton.destroy();
    }
}

export { Window };
