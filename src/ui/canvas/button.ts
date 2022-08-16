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

function create({ x = 0, y = 0, w = 0, h = 0, label, cansole }: Options): Button {
    const rect = shapes.rect.create(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w,
            h,
            bgColor: constants.colors.primary,
            interactive: true
        }
    );

    // TODO: this is duplicated from `render` and I think a `Theme` oject
    // would be a good idea for sure now.
    const fontSize = 18;
    const fontSizePx = `${fontSize}px`;
    const fontWeight = "normal";
    const fontFamily = "Perfect DOS VGA 437 Win";

    const canvas = cansole.element as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.font = `${fontWeight} ${fontSizePx} '${fontFamily}'`;
    const textWidth = ctx.measureText(label).width;

    const padding = 16;

    rect.w = textWidth + padding;
    rect.h = 24 + padding;

    rect.eventEmitter.on(events.Mouse.Click, function () {
        console.log("Clicked on Submit");
    });

    return {
        label,
        rect,
    };
}

function render(button: Button, ctx: CanvasRenderingContext2D): void {
    // Resetting these to default first and then maybe later change them.
    button.rect.bgColor = constants.colors.primary;
    document.body.style.cursor = "default";


    if (button.rect.isHovered) {
        button.rect.bgColor = constants.colors.primaryHovered;
        document.body.style.cursor = "pointer";
    }

    // `isActive` should come after `isHovered` because being active means
    // its hovered as well so we want `isActive` to come after `isHovered`.
    if (button.rect.isActive) {
        button.rect.bgColor = constants.colors.primary;
        document.body.style.cursor = "pointer";
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
        (button.rect.x + button.rect.w / 2),
        (button.rect.y + button.rect.h / 2)
    );
}

export { Button, create, render };
