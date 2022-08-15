import * as Types from "../../../types";

type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;

    bgColor: string;
    borderColor: string | null;
    borderRadius: number;
};

type Options = {
    x: number;
    y: number;
    w: number;
    h: number;

    bgColor?: string;
    borderColor?: string | null;
    borderRadius?: number;
};

function create({
    x,
    y,
    w,
    h,
    bgColor = "#000",
    borderColor = null,
    borderRadius = 0,
}: Options): Rect {
    return {
        x,
        y,
        w,
        h,
        bgColor,
        borderColor,
        borderRadius,
    };
}

function render(rect: Rect, ctx: Types.Context2D): void {
    ctx.fillStyle = rect.bgColor;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

export { Rect, create, render };
