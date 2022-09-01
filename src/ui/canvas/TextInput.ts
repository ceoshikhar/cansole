import * as constants from "../../constants";
import { EventEmitter } from "../../event-emitter";
import * as events from "../../events";

import { Box } from "./shapes/Box";
import {
    Clickable,
    ClickEventCallback,
    Drawable,
    Destroyable,
    HasDisplayName,
} from "./interfaces";

type TextInputOptions = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};

const defaultTextInputOptions = {
    x: 0,
    y: 0,
    w: 148,
    h: 22,
} as const;

type TextInputThemeables = {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    cursor: string;
    foregroundColor: string;
};

type TextInputTheme = TextInputThemeables & {
    hover: TextInputThemeables;
    active: TextInputThemeables;
};

type TextInputThemeOptions = Partial<TextInputThemeables> & {
    hover?: Partial<TextInputThemeables>;
    active?: Partial<TextInputThemeables>;
};

const defaultTextInputThemeables: TextInputThemeables = {
    backgroundColor: constants.colors.disabledPrimary,
    borderWidth: 0,
    borderColor: constants.colors.borderPrimaryDisabled,
    cursor: "text",
    foregroundColor: constants.colors.onDisabled,
};

const defaultTextInputTheme: TextInputTheme = {
    ...defaultTextInputThemeables,

    active: {
        ...defaultTextInputThemeables,
        backgroundColor: "#000000",
        borderColor: constants.colors.primary,
        foregroundColor: constants.colors.textPrimary,
    },

    hover: {
        ...defaultTextInputThemeables,
        borderWidth: 4,
    },
};

class TextInput
    implements Clickable<TextInput>, Drawable, Destroyable, HasDisplayName
{
    public theme: TextInputTheme;

    public displayName: string = "TextInput";

    private box: Box;
    private canvas: HTMLCanvasElement;

    private ee: EventEmitter;

    private isHovered = false;
    private isActive = false;

    constructor(
        canvas: HTMLCanvasElement,
        options: TextInputOptions = {},
        theme: TextInputThemeOptions = {}
    ) {
        this.canvas = canvas;

        this.theme = {
            ...defaultTextInputTheme,
            ...theme,
            hover: {
                ...defaultTextInputTheme.hover,
                ...theme.hover,
            },
            active: {
                ...defaultTextInputTheme.active,
                ...theme.active,
            },
        };

        this.box = new Box(
            canvas,
            {
                x: options.x || defaultTextInputOptions.x,
                y: options.y || defaultTextInputOptions.y,
                w: options.w || defaultTextInputOptions.w,
                h: options.h || defaultTextInputOptions.h,
            },
            {
                backgroundColor: this.theme.backgroundColor,
                borderColor: this.theme.borderColor,
                borderWidth: this.theme.borderWidth,
            }
        );

        //
        // Make this `TextInput` interactive.
        //

        this.ee = new EventEmitter();

        this.makeHoverable();

        this.box.onHover(() => {
            this.box.theme = this.theme.hover;
            this.canvas.style.cursor = this.theme.hover.cursor;
        });

        this.box.onHoverLost(() => {
            this.box.theme = this.theme;
            this.canvas.style.cursor = "auto";
        });
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

    public draw(): void {
        if (this.isHovered) {
            console.log(this.displayName, "is hovered");
        }

        if (this.isActive) {
            console.log(this.displayName, "is active");
        }

        this.box.draw();
    }

    public onClick(cb: ClickEventCallback<this>) {
        this.ee.on(events.MouseEvents.Click, cb);
    }

    public destroy(): void {}
}

export { TextInput };
