import * as constants from "../../constants";
import * as events from "../../events";
import { EventEmitter } from "../../event-emitter";
import { Cansole } from "../../Cansole";

import { Destroyable } from "./interfaces/Destroyable";
import { Drawable } from "./interfaces/Drawable";
import { Draggable, DragEventCallback } from "./interfaces/Draggable";
import { Box } from "./shapes/Box";
import { Button } from "./Button";

type WindowOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    cansole: Cansole;
};

class Window implements Destroyable, Drawable, Draggable {
    public title: string;

    // TODO: rename `box` something else like "drawableArea"?
    private box: Box;
    private titleBar: Box;
    private crossButton: Button;

    private ee: EventEmitter;

    constructor({ x, y, w, h, title, cansole }: WindowOptions) {
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

        this.title = title;
        this.box = box;
        this.crossButton = crossButton;
        this.titleBar = titleBar;
        this.ee = new EventEmitter();

        this.makeDraggable();

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
            const { deltaMovement } = e;
            const dx = deltaMovement[0];
            const dy = deltaMovement[1];

            this.box.setX(this.box.x + dx);
            this.box.setY(this.box.y + dy);

            this.titleBar.setX(this.titleBar.x + dx);
            this.titleBar.setY(this.titleBar.y + dy);

            this.crossButton.setX(this.crossButton.x + dx);
            this.crossButton.setY(this.crossButton.y + dy);
        });

        this.titleBar.onDrag(() => {
            this.ee.emit(events.MouseEvents.Drag, { target: this });
        });
    }

    public onDrag(cb: DragEventCallback<this>): void {
        this.ee.on(events.MouseEvents.Drag, cb);
    }

    public draw(): void {
        // Draw the entire window.
        this.box.draw();

        // Draw the window's title bar.
        this.titleBar.draw();

        // Draw the title bar's close button.
        this.crossButton.draw();
    }

    public destroy(): void {
        console.log("Destroying Window");

        this.box.destroy();
        this.titleBar.destroy();
        this.crossButton.destroy();
    }
}

export { Window };
