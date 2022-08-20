import * as constants from "../../constants";
import * as types from "../../types";

import * as events from "./events";
import * as shapes from "./shapes";

type Button = {
    label: string;
    rect: shapes.rect.Rect;
};

type Options = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    label: string;
    cansole: types.Cansole;
};

function create({
    x = 0,
    y = 0,
    w = 0,
    h = 0,
    label,
    cansole,
}: Options): Button {
    const rect = shapes.rect.create(cansole.element as HTMLCanvasElement, {
        x,
        y,
        w,
        h,
        bgColor: constants.colors.primary,
    });

    shapes.rect.makeClickable(rect, cansole.element as HTMLCanvasElement);
    shapes.rect.makeHoverable(rect, cansole.element as HTMLCanvasElement);

    rect.eventEmitter.on(events.mouse.Hover, function () {
        rect.bgColor = constants.colors.primaryHovered;
        document.body.style.cursor = "pointer";
    });

    rect.eventEmitter.on(events.mouse.HoverLost, function () {
        rect.bgColor = constants.colors.primary;
        document.body.style.cursor = "auto";
    });

    rect.eventEmitter.on(events.mouse.Active, function () {
        if (rect.isHovered) {
            rect.bgColor = constants.colors.primary;
            document.body.style.cursor = "pointer";
        }
    });

    rect.eventEmitter.on(events.mouse.ActiveLost, function () {
        if (rect.isHovered) {
            rect.bgColor = constants.colors.primaryHovered;
            document.body.style.cursor = "poiner";
        } else {
            rect.bgColor = constants.colors.primary;
            document.body.style.cursor = "auto";
        }
    });

    // TODO: this is duplicated from `render` and I think a `Theme` oject
    // would be a good idea for sure now.
    const fontSize = 18;
    const fontSizePx = `${fontSize}px`;
    const fontWeight = "normal";
    const fontFamily = "Perfect DOS VGA 437 Win";

    const canvas = cansole.element as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;


    ctx.font = `${fontWeight} ${fontSizePx} '${fontFamily}'`;
    const textWidth = ctx.measureText(label).width;

    const padding = 16;

    rect.w = w || textWidth + padding;
    rect.h = h || 24 + padding;

    return {
        label,
        rect,
    };
}

function render(button: Button, ctx: CanvasRenderingContext2D): void {
    if (button.rect.isHovered) {
        console.log(button.label, "is hovered");
    }

    if (button.rect.isActive) {
        console.log(button.label, "is active");
    }

    if (button.rect.isDragging) {
        console.log(button.label, "is dragging");
    }

    //
    // Draw button's rectangle.
    //

    shapes.rect.render(button.rect, ctx);

    //
    // Draw button's label.
    //

    // TODO: Make this a part of `Button Theme` ?
    const fontSize = 18;
    const fontSizePx = `${fontSize}px`;
    const fontWeight = "normal";
    const fontFamily = "Perfect DOS VGA 437 Win";

    ctx.font = `${fontWeight} ${fontSizePx} '${fontFamily}'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = constants.colors.onPrimary;

    ctx.fillText(
        button.label,
        button.rect.x + button.rect.w / 2,
        button.rect.y + button.rect.h / 2
    );
}

export { Button, create, render };
