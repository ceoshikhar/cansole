import * as constants from "../../constants";
import * as utils from "../../utils";
import { Drawable, Themeable, Themeables } from "./interfaces";

type TextOptions = {
    x?: number;
    y?: number;
    maxWidth?: number;
};

type TextTheme = Pick<
    Themeables,
    | "fontFamily"
    | "fontSize"
    | "fontWeight"
    | "foregroundColor"
    | "textAlign"
    | "textBaseline"
>;

type TextThemeOptions = Partial<TextTheme>;

const defaultTextOptions = {
    x: 0,
    y: 0,
} as const;

const defaultTextTheme: TextTheme = {
    fontFamily: "Perfect DOS VGA 437 Win",
    fontSize: 18,
    fontWeight: "normal",
    foregroundColor: constants.colors.textPrimary,
    textAlign: "start",
    textBaseline: "alphabetic",
};

class Text implements Drawable, TextOptions, Themeable<TextTheme> {
    public text: string;

    private canvas: HTMLCanvasElement;
    public theme: TextTheme;

    public x: number;
    public y: number;
    public maxWidth?: number;

    constructor(
        canvas: HTMLCanvasElement,
        text: string,
        options: TextOptions = {},
        theme: TextThemeOptions = {}
    ) {
        this.canvas = canvas;
        this.text = text;

        this.theme = { ...defaultTextTheme, ...theme };

        this.x = options.x || defaultTextOptions.x;
        this.y = options.y || defaultTextOptions.y;
        this.maxWidth = options.maxWidth;
    }

    public measureText(): TextMetrics {
        const ctx = utils.getContext2D(this.canvas);
        ctx.font = `${this.theme.fontWeight} ${this.theme.fontSize}px '${this.theme.fontFamily}'`;
        return ctx.measureText(this.text);
    }

    public draw(): void {
        const ctx = utils.getContext2D(this.canvas);

        ctx.font = `${this.theme.fontWeight} ${this.theme.fontSize}px '${this.theme.fontFamily}'`;
        ctx.textAlign = this.theme.textAlign;
        ctx.textBaseline = this.theme.textBaseline;
        ctx.fillStyle = this.theme.foregroundColor;
        ctx.fillText(this.text, this.x, this.y, this.maxWidth);
    }
}

export { Text };
