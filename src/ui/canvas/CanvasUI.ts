import { Cansole } from "../../Cansole";
import * as utils from "../../utils";
import { Vec2 } from "../../math";

import { Button } from "./Button";
import { Drawable } from "./interfaces/Drawable";
import { Destroyable } from "./interfaces/Destroyable";
import { Window } from "./Window";

const WINDOW_POS_STORAGE_KEY = "window_pos";
const WINDOW_SIZE_STORAGE_KEY = "window_size";

const DEFAULT_WINDOW_POS: Vec2<number> = new Vec2(150, 150);
const DEFAULT_WINDOW_SIZE: Vec2<number> = new Vec2(640, 480);

type Entities = Array<Destroyable & Drawable>;

class CanvasUI implements Destroyable, Drawable {
    private entities: Entities;

    constructor(cansole: Cansole) {
        if (!utils.isCanvas(cansole.element)) {
            throw new Error(
                "CanvasUI.constructor: cansole.element is not an" +
                    " HTMLCanvasElement."
            );
        }

        this.entities = [];

        cansole.onHide(() => this.destroy());
        cansole.onShow((cansole) => this.init(cansole));
    }

    public init(cansole: Cansole): void {
        console.log("Initialising CanvasUI");

        const initPosStr: string | null = window.localStorage.getItem(
            WINDOW_POS_STORAGE_KEY
        );
        const initPos: Vec2<number> =
            initPosStr === null ? DEFAULT_WINDOW_POS : JSON.parse(initPosStr);

        // TODO: store windows position and size in LocalStorage ?
        const myWindow = new Window({
            x: initPos.v1,
            y: initPos.v2,
            w: 640,
            h: 480,
            title: cansole.options.title,
            cansole: cansole,
        });

        const submitButton = new Button(
            cansole.element as HTMLCanvasElement,
            "Submit"
        );

        submitButton.onClick(() => {
            console.log("Clicked on Submit");
        });

        this.entities = [];

        this.entities.push(myWindow);
        this.entities.push(submitButton);

        this.positionButtonRelativeToWindow(submitButton, myWindow);

        myWindow.onDrag(() =>
            this.positionButtonRelativeToWindow(submitButton, myWindow)
        );

        myWindow.onDragEnd((e) => {
            const pos: Vec2<number> = new Vec2(e.target.x, e.target.y);
            window.localStorage.setItem(
                WINDOW_POS_STORAGE_KEY,
                JSON.stringify(pos)
            );
        });
    }

    public draw(): void {
        this.entities.forEach((entity) => entity.draw());
    }

    public destroy(): void {
        console.log("Destroying CanvasUI");
        this.entities.forEach((entity) => entity.destroy());
        this.entities = [];
    }

    // TODO: instead of this we should have "child" <-> "parent" elements to be
    // "drawn" relative to each other?
    private positionButtonRelativeToWindow(
        button: Button,
        window: Window
    ): void {
        const buttonPaddingWithWindow = 16;

        button.setR(window.r - buttonPaddingWithWindow);
        button.setB(window.b - buttonPaddingWithWindow);
    }
}

export { CanvasUI };
