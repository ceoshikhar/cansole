import { Cansole } from "../../Cansole";
import * as utils from "../../utils";
import { Vec2 } from "../../math";

import { Button } from "./Button";
import { Drawable, Destroyable } from "./interfaces";
import { Window } from "./Window";
import { TextInput } from "./TextInput";

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

        const initSizeStr: string | null = window.localStorage.getItem(
            WINDOW_SIZE_STORAGE_KEY
        );
        const initSize: Vec2<number> =
            initSizeStr === null
                ? DEFAULT_WINDOW_SIZE
                : JSON.parse(initSizeStr);

        const cansoleWindow = new Window({
            x: initPos.v1,
            y: initPos.v2,
            w: initSize.v1,
            h: initSize.v2,
            title: cansole.options.title,
            cansole: cansole,
        });

        const submit = new Button(
            cansole.element as HTMLCanvasElement,
            "Submit"
        );

        submit.setDisplayName("Submit");

        submit.onClick((e) => {
            console.log("Clicked on", e.target.displayName);
        });

        const input = new TextInput(cansole.element as HTMLCanvasElement, {
            h: submit.h,
        });

        input.setDisplayName("CommandTextInput");

        input.onClick((e) => {
            console.log("Clicked on", e.target.displayName);
        });

        this.entities = [];

        this.entities.push(cansoleWindow);
        this.entities.push(submit);
        this.entities.push(input);

        // TODO: instead of this we should have "child" <-> "parent" elements
        // to be "drawn" relative to each other instead of the entire canvas.
        const positionAndResizeElements = () => {
            this.positionSubmitOnWindowResize(submit, cansoleWindow);
            this.positionInputOnWindowResize(input, cansoleWindow);
            this.resizeInputOnWindowReize(input, submit);
        };

        // Need to position and resize the elements on the init as well.
        positionAndResizeElements();

        cansoleWindow.onDrag(() => {
            positionAndResizeElements();
        });

        cansoleWindow.onDragEnd((e) => {
            const pos: Vec2<number> = new Vec2(e.target.x, e.target.y);
            window.localStorage.setItem(
                WINDOW_POS_STORAGE_KEY,
                JSON.stringify(pos)
            );
        });

        cansoleWindow.onResize(() => {
            positionAndResizeElements();
        });

        cansoleWindow.onResizeEnd((e) => {
            const size: Vec2<number> = new Vec2(e.target.w, e.target.h);
            window.localStorage.setItem(
                WINDOW_SIZE_STORAGE_KEY,
                JSON.stringify(size)
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

    private positionSubmitOnWindowResize(submit: Button, window: Window): void {
        const buttonPaddingWithWindow = 16;

        submit.setR(window.r - buttonPaddingWithWindow);
        submit.setB(window.b - buttonPaddingWithWindow);
    }

    private positionInputOnWindowResize(
        input: TextInput,
        window: Window
    ): void {
        const inputPaddingWithWindow = 16;

        input.setL(window.l + inputPaddingWithWindow);
        input.setB(window.b - inputPaddingWithWindow);
    }

    private resizeInputOnWindowReize(input: TextInput, submit: Button) {
        const gapBetweenInputAndSubmit = 16;

        input.setW(submit.x - input.x - gapBetweenInputAndSubmit);
    }
}

export { CanvasUI };
