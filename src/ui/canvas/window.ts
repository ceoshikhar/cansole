import * as constants from "../../constants";
import * as utils from "../../utils";
import * as types from "../../types";

import * as button from "./button";
import * as events from "./events";
import { Box } from "./shapes";

type Window = {
    title: string;

    // Private
    box: Box;
    titleBar: Box;
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
    const box: Box = new Box(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w,
            h,
        },
        {
            backgroundColor: constants.colors.background,
        }
    );

    const crossButton: button.Button = button.create({
        x: x + w - 30,
        y,
        w: 30,
        h: 30,
        label: "x",
        cansole
    });

    crossButton.box.ee.on(events.mouse.Click, function () {
        console.log("Clicked on Cross");
    });

    const titleBar: Box = new Box(
        cansole.element as HTMLCanvasElement,
        {
            x,
            y,
            w: w - 30,
            h: 30,
        },
        {
            backgroundColor: constants.colors.background2,
        }
    );

    titleBar.makeDraggable();

    titleBar.ee.on(events.mouse.Drag, function ({ deltaMovement }) {
        console.log("Dragging Window");

        const dx = deltaMovement[0];
        const dy = deltaMovement[1];

        box.setX(box.x + dx);
        box.setY(box.y + dy);

        titleBar.setX( titleBar.x + dx);
        titleBar.setY(titleBar.y + dy);

        crossButton.box.setX(crossButton.box.x + dx);
        crossButton.box.setY(crossButton.box.y + dy);

        utils.positionButtonRelativeToWindow(cansole);
    });

    return {
        title,
        box,
        titleBar,
        crossButton,
    };
}

function render(window: Window, ctx: CanvasRenderingContext2D): void {
    // Draw the entire window.
    window.box.draw();

    // Draw the window's title bar.
    window.titleBar.draw();

    // Draw the title bar's close button.
    button.render(window.crossButton, ctx);
}

export { Window, create, render };
