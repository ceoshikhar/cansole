import * as constants from "../../constants";
import * as utils from "../../utils";
import * as types from "../../types";

import * as button from "./button";
import * as events from "./events";
import * as shapes from "./shapes";

type Window = {
    title: string;

    // Private
    rect: shapes.rect.Rect;
    titleBar: shapes.rect.Rect;
    crossButton: button.Button;
};

type Options = {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    cansole: types.Cansole;
};

function create({ x, y, w, h, title, cansole }: Options): Window {
    const rect: shapes.rect.Rect = shapes.rect.create(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w,
            h,
            bgColor: constants.colors.background,
        }
    );

    const titleBar: shapes.rect.Rect = shapes.rect.create(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w: w - 30,
            h: 30,
            bgColor: constants.colors.background2,
        }
    );

    titleBar.eventEmitter.on(events.mouse.Drag, function ({ deltaMovement }) {
        console.log("Dragging Window");

        const dx = deltaMovement[0];
        const dy = deltaMovement[1];

        shapes.rect.setX(rect, rect.x + dx);
        shapes.rect.setY(rect, rect.y + dy);

        shapes.rect.setX(titleBar, titleBar.x + dx);
        shapes.rect.setY(titleBar, titleBar.y + dy);

        shapes.rect.setX(crossButton.rect, crossButton.rect.x + dx);
        shapes.rect.setY(crossButton.rect, crossButton.rect.y + dy);

        utils.positionButtonRelativeToWindow(cansole);
    });

    const crossButton: button.Button = button.create({
        x: x + w - 30,
        y,
        w: 30,
        h: 30,
        label: "x",
        cansole
    });

    crossButton.rect.eventEmitter.on(events.mouse.Click, function () {
        console.log("Clicked on Cross");
    });

    return {
        title,
        rect,
        titleBar,
        crossButton,
    };
}

function render(window: Window, ctx: CanvasRenderingContext2D): void {
    // Draw the entire window.
    shapes.rect.render(window.rect, ctx);

    // Draw the window's title bar.
    shapes.rect.render(window.titleBar, ctx);

    // Draw the title bar's close button.
    button.render(window.crossButton, ctx);
}

export { Window, create, render };
