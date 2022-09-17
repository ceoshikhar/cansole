import * as constants from "../../constants";
import { EventEmitter } from "../../event-emitter";
import * as events from "../../events";

import {
    IActivable,
    ActiveEventCallback,
    ActiveLostEventCallback,
    IClickable,
    ClickEventCallback,
    IDrawable,
    IDestroyable,
    IDisplayName,
    IHoverable,
    HoverEventCallback,
    HoverLostEventCallback,
    IRect,
    IThemeable,
    Themeables,
} from "./interfaces";
import { Box } from "./Box";
import { Text } from "./Text";
import { Vec2 } from "../../math";

type ButtonOptions = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};

type ButtonThemeables = Pick<
    Themeables,
    "backgroundColor" | "borderColor" | "borderWidth" | "cursor" | "foregroundColor"
>;

type ButtonTheme = ButtonThemeables & {
    hover: ButtonThemeables;
    active: ButtonThemeables;
};

type ButtonThemeOptions = Partial<ButtonThemeables> & {
    hover?: Partial<ButtonThemeables>;
    active?: Partial<ButtonThemeables>;
};

const defaultButtonOptions = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};

const defaultButtonThemeables: ButtonThemeables = {
    backgroundColor: constants.colors.primary,
    borderColor: "white",
    borderWidth: 0,
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
        IActivable<Button>,
        IClickable<Button>,
        IDestroyable,
        IDrawable,
        IDisplayName,
        IHoverable<Button>,
        IRect,
        IThemeable<ButtonTheme>
{
    public theme: ButtonTheme;

    public displayName = "Button";

    private canvas: HTMLCanvasElement;
    private box: Box;
    private label: string;

    private ee: EventEmitter;

    private isActive = false;
    private isHovered = false;

    constructor(canvas: HTMLCanvasElement, label: string, options: ButtonOptions = {}, theme: ButtonThemeOptions = {}) {
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

        this.box = new Box(
            canvas,
            {
                x: options.x || defaultButtonOptions.x,
                y: options.y || defaultButtonOptions.y,
                w: options.w || defaultButtonOptions.w,
                h: options.h || defaultButtonOptions.h,
            },
            {
                backgroundColor: this.theme.backgroundColor,
                borderColor: this.theme.borderColor,
                borderWidth: this.theme.borderWidth,
            }
        );

        //
        // Make this `Button` interactive.
        //

        this.ee = new EventEmitter();

        this.makeHoverable();
        this.makeActivable();
        this.makeClickable();

        this.box.onHover(() => {
            this.box.theme = this.theme.hover;
            this.canvas.style.cursor = this.theme.hover.cursor;
        });

        this.box.onHoverLost(() => {
            this.box.theme = this.theme;
            this.canvas.style.cursor = "auto";
        });

        this.box.onActive(() => {
            this.box.theme = this.theme.active;
            this.canvas.style.cursor = this.theme.active.cursor;
        });

        this.box.onActiveLost(() => {
            if (this.box.isHovered) {
                this.box.theme = this.theme.hover;
                this.canvas.style.cursor = this.theme.hover.cursor;
            } else {
                this.box.theme = this.theme;
                this.canvas.style.cursor = "auto";
            }
        });

        const textWidth = new Text(canvas, label).measureText().width;
        const padding = 16;

        this.box.w = options.w || textWidth + padding;
        this.box.h = options.h || 24 + padding;
    }

    public setDisplayName(name: string): void {
        this.displayName = name;
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

    public setPos(newPos: Vec2<number>): void {
        this.box.setPos(newPos);
    }

    public setSize(newSize: Vec2<number>): void {
        this.box.setSize(newSize);
    }

    public setX(newX: number): void {
        this.box.setX(newX);
    }

    public setY(newY: number): void {
        this.box.setY(newY);
    }

    public setW(newW: number): void {
        this.box.setW(newW);
    }

    public setH(newH: number): void {
        this.box.setH(newH);
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

    public contains(point: Vec2<number>): boolean {
        return this.box.contains(point);
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

        this.box.onClick((e) => {
            this.ee.emit(events.MouseEvents.Click, {
                native: e.native,
                target: this,
            });
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
        this.box.destroy();
    }
}

export { Button };
