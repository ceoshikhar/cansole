import * as constants from "../../constants";
import * as types from "../../types";

import * as events from "./events";
import { Box } from "./shapes/Box";

type Button = {
    label: string;
    box: Box;
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
    const box = new Box(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w,
            h,
        },
        {
            backgroundColor: constants.colors.primary,
        }
    );

    box.makeClickable();
    box.makeHoverable();

    box.ee.on(events.mouse.Hover, function () {
        box.theme.backgroundColor = constants.colors.primaryHovered;
        document.body.style.cursor = "pointer";
    });

    box.ee.on(events.mouse.HoverLost, function () {
        box.theme.backgroundColor = constants.colors.primary;
        document.body.style.cursor = "auto";
    });

    box.ee.on(events.mouse.Active, function () {
        if (box.isHovered) {
            box.theme.backgroundColor = constants.colors.primary;
            document.body.style.cursor = "pointer";
        }
    });

    box.ee.on(events.mouse.ActiveLost, function () {
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

    const canvas = cansole.element as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.font = `${fontWeight} ${fontSizePx} '${fontFamily}'`;
    const textWidth = ctx.measureText(label).width;

    const padding = 16;

    box.w = w || textWidth + padding;
    box.h = h || 24 + padding;

    return {
        label,
        box,
    };
}

function render(button: Button, ctx: CanvasRenderingContext2D): void {
    if (button.box.isHovered) {
        console.log(button.label, "is hovered");
    }

    if (button.box.isActive) {
        console.log(button.label, "is active");
    }

    if (button.box.isDragging) {
        console.log(button.label, "is dragging");
    }

    //
    // Draw button's rectangle.
    //

    button.box.draw();

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
        button.box.x + button.box.w / 2,
        button.box.y + button.box.h / 2
    );
}

export { Button, create, render };
