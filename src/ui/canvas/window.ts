import * as constants from "../../constants";
import * as utils from "../../utils";
import { Cansole } from "../../Cansole";

import { Box } from "./shapes/Box";
import { Button } from "./Button";

type Window = {
    title: string;

    // Private
    box: Box;
    titleBar: Box;
    crossButton: Button;
};

type Options = {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    cansole: Cansole;
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

    const xButton: Button = new Button(
        cansole.element as HTMLCanvasElement,
        "X",
        {
            x: x + w - 30,
            y,
            w: 30,
            h: 30,
        }
    );

    xButton.onClick(() => {
        console.log("Clicked on X");
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

    titleBar.onDrag((e) => {
        console.log("Dragging window");
        const { deltaMovement } = e;
        const dx = deltaMovement[0];
        const dy = deltaMovement[1];

        box.setX(box.x + dx);
        box.setY(box.y + dy);

        titleBar.setX(titleBar.x + dx);
        titleBar.setY(titleBar.y + dy);

        xButton.setX(xButton.x + dx);
        xButton.setY(xButton.y + dy);

        utils.positionButtonRelativeToWindow(cansole);
    });

    return {
        title,
        box,
        titleBar,
        crossButton: xButton,
    };
}

function render(window: Window): void {
    // Draw the entire window.
    window.box.draw();

    // Draw the window's title bar.
    window.titleBar.draw();

    // Draw the title bar's close button.
    window.crossButton.draw();
}

export { Window, create, render };
