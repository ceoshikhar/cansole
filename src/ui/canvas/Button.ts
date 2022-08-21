import { EventEmitter } from "../../event-emitter";
import * as constants from "../../constants";

import { Box } from "./shapes/Box";
import { Clickable, ClickEventCallback } from "./interfaces/Clickable";
import { Drawable } from "./interfaces/Drawable";
import * as events from "./events";
import * as utils from "./utils";

type ButtonOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
};

type ButtonTheme = {
    backgroundColor: string;
    foregroundColor: string;
};

const defaultButtonOptions: ButtonOptions = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};

const defaultButtonTheme: ButtonTheme = {
    backgroundColor: constants.colors.primary,
    foregroundColor: constants.colors.onPrimary,
};

class Button implements Drawable, Clickable<Button> {
    public label: string;

    private canvas: HTMLCanvasElement;
    private theme: ButtonTheme;

    private box: Box;

    private ee: EventEmitter;

    private isActive = false;
    private isHovered = false;

    constructor(
        canvas: HTMLCanvasElement,
        label: string,
        options: Partial<ButtonOptions> = {},
        theme: Partial<ButtonTheme> = {}
    ) {
        this.canvas = canvas;
        this.label = label;

        this.theme = { ...defaultButtonTheme, ...theme };

        const finalOptions: ButtonOptions = {
            ...defaultButtonOptions,
            ...options,
        };

        const box = new Box(
            canvas,
            {
                x: finalOptions.x,
                y: finalOptions.y,
                w: finalOptions.w,
                h: finalOptions.h,
            },
            {
                backgroundColor: this.theme.backgroundColor,
            }
        );

        this.box = box;

        //
        // Make this `Button` interactive.
        //

        this.ee = new EventEmitter();

        this.makeClickable();
        box.makeActivable();
        box.makeHoverable();

        //
        // Attach event listeners to `box`.
        //

        box.onHover(() => {
            box.theme.backgroundColor = constants.colors.primaryHovered;
            document.body.style.cursor = "pointer";
        });

        box.onHoverLost(() => {
            box.theme.backgroundColor = constants.colors.primary;
            document.body.style.cursor = "auto";
        });

        box.onActive(() => {
            if (box.isHovered) {
                box.theme.backgroundColor = constants.colors.primary;
                document.body.style.cursor = "pointer";
            }
        });

        box.onActiveLost(() => {
            if (box.isHovered) {
                box.theme.backgroundColor = constants.colors.primaryHovered;
                document.body.style.cursor = "poiner";
            } else {
                box.theme.backgroundColor = constants.colors.primary;
                document.body.style.cursor = "auto";
            }
        });

        // TODO: this is duplicated from `render` and I think a `Theme` oject
        // would be a good idea for sure now.
        const fontSize = 18;
        const fontSizePx = `${fontSize}px`;
        const fontWeight = "normal";
        const fontFamily = "Perfect DOS VGA 437 Win";

        const ctx = utils.getContext2D(this.canvas);

        ctx.font = `${fontWeight} ${fontSizePx} '${fontFamily}'`;
        const textWidth = ctx.measureText(label).width;

        const padding = 16;

        box.w = finalOptions.w || textWidth + padding;
        box.h = finalOptions.h || 24 + padding;
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

    private makeClickable(): void {
        this.box.makeClickable();
        this.box.onClick(() =>
            this.ee.emit(events.mouse.Click, { target: this })
        );
    }

    public onClick(cb: ClickEventCallback<this>): void {
        this.ee.on(events.mouse.Click, cb);
    }

    public draw(): void {
        /*
        if (this.box.isHovered) {
            console.log(this.label, "is hovered");
        }

        if (this.box.isActive) {
            console.log(this.label, "is active");
        }

        if (this.box.isDragging) {
            console.log(this.label, "is dragging");
        }
        */

        //
        // Draw button's rectangle.
        //

        this.box.draw();

        //
        // Draw button's label.
        //

        // TODO: Make this a part of `Button Theme` ?
        const fontSize = 18;
        const fontSizePx = `${fontSize}px`;
        const fontWeight = "normal";
        const fontFamily = "Perfect DOS VGA 437 Win";

        const ctx = utils.getContext2D(this.canvas);

        ctx.font = `${fontWeight} ${fontSizePx} '${fontFamily}'`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.theme.foregroundColor;

        ctx.fillText(
            this.label,
            this.x + this.w / 2,
            this.y + this.h / 2
        );
    }
}

export { Button };
