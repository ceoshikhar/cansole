import * as constants from "../../constants";
import { EventEmitter } from "../../event-emitter";
import * as events from "../../events";
import { Vec2, Vec4 } from "../../math";
import { Box } from "./Box";
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

type TextAreaOptions = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};

const defaultTextInputOptions = {
    x: 0,
    y: 0,
    w: 150,
    h: 60,
} as const;

type TextAreaThemeables = Pick<
    Themeables,
    | "backgroundColor"
    | "borderColor"
    | "borderWidth"
    | "cursor"
    | "fontFamily"
    | "fontSize"
    | "fontWeight"
    | "foregroundColor"
    | "padding"
    | "textAlign"
    | "textBaseline"
>;

type TextAreaTheme = TextAreaThemeables & {
    hover: TextAreaThemeables;
    active: TextAreaThemeables;
};

type TextAreaThemeOptions = Partial<TextAreaThemeables> & {
    hover?: Partial<TextAreaThemeables>;
    active?: Partial<TextAreaThemeables>;
};

const defaultTextAreaThemeables: TextAreaThemeables = {
    backgroundColor: constants.colors.disabledPrimary,
    borderWidth: 0,
    borderColor: constants.colors.borderPrimaryDisabled,
    cursor: "text",
    fontFamily: "Dank Mono",
    fontSize: 18,
    fontWeight: "normal",
    foregroundColor: constants.colors.onDisabled,
    padding: new Vec4(4, 8, 4, 8),
    textAlign: "start",
    textBaseline: "middle",
};

const defaultTextAreaTheme: TextAreaTheme = {
    ...defaultTextAreaThemeables,

    active: {
        ...defaultTextAreaThemeables,
        backgroundColor: "#000000",
        borderColor: constants.colors.primary,
        borderWidth: 2,
        foregroundColor: constants.colors.textPrimary,
    },

    hover: {
        ...defaultTextAreaThemeables,
        borderWidth: 2,
    },
};

class TextArea
    implements
        IActivable<TextArea>,
        IClickable<TextArea>,
        IDestroyable,
        IDrawable,
        IDisplayName,
        IHoverable<TextArea>,
        IRect,
        IThemeable<TextAreaTheme>
{
    public displayName = "TextArea";
    public theme: TextAreaTheme;

    private canvas: HTMLCanvasElement;
    private box: Box;

    private ee: EventEmitter;

    private isActive = false;

    constructor(canvas: HTMLCanvasElement, options: TextAreaOptions = {}, theme: TextAreaThemeOptions = {}) {
        this.canvas = canvas;

        this.theme = {
            ...defaultTextAreaTheme,
            ...theme,
            hover: {
                ...defaultTextAreaTheme.hover,
                ...theme.hover,
            },
            active: {
                ...defaultTextAreaTheme.active,
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

        this.box.setH(options.h || this.box.h + this.theme.padding.v1 + this.theme.padding.v3);
        this.box.setW(options.w || this.box.w + this.theme.padding.v2 + this.theme.padding.v4);

        //
        // Make this `TextArea` interactive.
        //

        this.ee = new EventEmitter();

        this.makeActivable();
        this.makeHoverable();
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
            this.ee.emit(events.MouseEvents.Hover, { target: this });
        });

        this.box.onHoverLost(() => {
            this.ee.emit(events.MouseEvents.HoverLost, { target: this });
        });
    }

    private makeActivable(): void {
        this.box.makePressable();

        this.box.onPress(() => {
            if (!this.isActive) {
                this.isActive = true;
                this.ee.emit(events.MouseEvents.Active, { target: this });
            }
        });

        this.canvas.addEventListener("mousedown", (e) => {
            // Somewhere on canvas outside this `TextBox`.
            if (!this.box.contains(new Vec2(e.offsetX, e.offsetY))) {
                if (this.isActive) {
                    this.isActive = false;

                    this.ee.emit(events.MouseEvents.ActiveLost, {
                        target: this,
                    });
                }
            }
        });
    }

    public onActive(cb: ActiveEventCallback<TextArea>): void {
        this.ee.on(events.MouseEvents.Active, cb);
    }

    public onActiveLost(cb: ActiveLostEventCallback<TextArea>): void {
        this.ee.on(events.MouseEvents.ActiveLost, cb);
    }
    public onHover(cb: HoverEventCallback<TextArea>): void {
        this.ee.on(events.MouseEvents.Hover, cb);
    }

    public onHoverLost(cb: HoverLostEventCallback<TextArea>): void {
        this.ee.on(events.MouseEvents.HoverLost, cb);
    }

    public onClick(cb: ClickEventCallback<TextArea>): void {
        this.ee.on(events.MouseEvents.Click, cb);
    }

    public draw(): void {
        this.box.draw();
    }

    public destroy(): void {
        this.ee.emit(events.CoreEvents.Destroy);
    }
}

export { TextArea };
