import * as constants from "../../constants";
import { EventEmitter } from "../../event-emitter";
import * as events from "../../events";

import { Box } from "./shapes/Box";
import { Text } from "./Text";
import {
    Activable,
    ActiveEventCallback,
    ActiveLostEventCallback,
    Clickable,
    ClickEventCallback,
    Drawable,
    Destroyable,
    Hoverable,
    HoverEventCallback,
    HoverLostEventCallback,
    Themeable,
} from "./interfaces";

type ButtonOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
};

type ButtonThemeables = {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    cursor: string;
    foregroundColor: string;
};

type ButtonTheme = ButtonThemeables & {
    hover: ButtonThemeables;
    active: ButtonThemeables;
};

type ButtonThemeOptions = Partial<ButtonThemeables> & {
    hover?: Partial<ButtonThemeables>;
    active?: Partial<ButtonThemeables>;
};

const defaultButtonOptions: ButtonOptions = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};

const defaultButtonThemeables: ButtonThemeables = {
    backgroundColor: constants.colors.primary,
    borderWidth: 0,
    borderColor: "white",
    cursor: "auto",
    foregroundColor: constants.colors.onPrimary,
};

const defaultButtonTheme: ButtonTheme = {
    ...defaultButtonThemeables,

    active: {
        ...defaultButtonThemeables,
        backgroundColor: constants.colors.primary,
        cursor: "pointer",
    },

    hover: {
        ...defaultButtonThemeables,
        backgroundColor: constants.colors.primaryHovered,
        cursor: "pointer",
    },
};

class Button
    implements
        Activable<Button>,
        Clickable<Button>,
        Destroyable,
        Drawable,
        Hoverable<Button>,
        Themeable<ButtonTheme>
{
    public theme: ButtonTheme;

    private canvas: HTMLCanvasElement;
    private box: Box;
    private label: string;

    private ee: EventEmitter;

    private isActive = false;
    private isHovered = false;

    constructor(
        canvas: HTMLCanvasElement,
        label: string,
        options: Partial<ButtonOptions> = {},
        theme: ButtonThemeOptions = {}
    ) {
        this.canvas = canvas;
        this.label = label;

        this.theme = {
            ...defaultButtonTheme,
            ...theme,
            hover: {
                ...defaultButtonTheme.hover,
                ...theme.hover,
            },
            active: {
                ...defaultButtonTheme.active,
                ...theme.active,
            },
        };

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
                borderWidth: this.theme.borderWidth,
                borderColor: this.theme.borderColor,
            }
        );

        this.box = box;

        //
        // Make this `Button` interactive.
        //

        this.ee = new EventEmitter();

        this.makeClickable();
        this.makeActivable();
        this.makeHoverable();

        //
        // Attach event listeners to `box`.
        //

        box.onHover(() => {
            box.theme = this.theme.hover;
            this.canvas.style.cursor = this.theme.hover.cursor;
        });

        box.onHoverLost(() => {
            box.theme = this.theme;
            this.canvas.style.cursor = "auto";
        });

        box.onActive(() => {
            if (this.box.isHovered) {
                box.theme = this.theme.active;
                this.canvas.style.cursor = this.theme.active.cursor;
            }
            // Is it even possible for Button to be active if it's not hvoered?
        });

        box.onActiveLost(() => {
            if (box.isHovered) {
                box.theme = this.theme.hover;
                this.canvas.style.cursor = this.theme.hover.cursor;
            } else {
                box.theme = this.theme;
                this.canvas.style.cursor = "auto";
            }
        });

        const textWidth = new Text(canvas, label).measureText().width;
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

    private makeHoverable(): void {
        this.box.makeHoverable();

        this.box.onHover(() => {
            this.isHovered = true;
            this.ee.emit(events.MouseEvents.Hover, { target: this });
        });

        this.box.onHoverLost(() => {
            this.isHovered = false;
            this.ee.emit(events.MouseEvents.HoverLost, { target: this });
        });
    }

    private makeActivable(): void {
        this.box.makeActivable();

        this.box.onActive(() => {
            this.isActive = true;
            this.ee.emit(events.MouseEvents.Active, { target: this });
        });

        this.box.onActiveLost(() => {
            this.isActive = false;
            this.ee.emit(events.MouseEvents.ActiveLost, { target: this });
        });
    }

    private makeClickable(): void {
        this.box.makeClickable();

        this.box.onClick(() => {
            this.ee.emit(events.MouseEvents.Click, { target: this });
        });
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

    public onClick(cb: ClickEventCallback<this>): void {
        this.ee.on(events.MouseEvents.Click, cb);
    }

    public draw(): void {
        if (this.isHovered) {
            console.log(this.label, "is hovered");
        }

        if (this.isActive) {
            console.log(this.label, "is active");
        }

        //
        // Draw button's rectangle.
        //

        this.box.draw();

        //
        // Draw button's label.
        //

        const foregroundColor = this.isHovered
            ? this.theme.hover.foregroundColor
            : this.isActive
            ? this.theme.active.foregroundColor
            : this.theme.foregroundColor;

        new Text(
            this.canvas,
            this.label,
            { x: this.x + this.w / 2, y: this.y + this.h / 2 },
            {
                foregroundColor,
                textAlign: "center",
                textBaseline: "middle",
            }
        ).draw();
    }

    public destroy(): void {
        console.log("Destroying Button", this.label);
        this.box.destroy();
    }
}

export { Button };
