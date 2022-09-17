import { Cansole } from "../../Cansole";
import * as utils from "../../utils";
import { Vec2 } from "../../math";

import { Button } from "./Button";
import { IDrawable, IDestroyable } from "./interfaces";
import { Window } from "./Window";
import { TextInput } from "./TextInput";

const DEFAULT_WINDOW_POS: Vec2<number> = new Vec2(150, 150);
const DEFAULT_WINDOW_SIZE: Vec2<number> = new Vec2(640, 480);

type Entities = Array<IDestroyable & IDrawable>;

class CanvasUI implements IDestroyable, IDrawable {
    private entities: Entities;

    constructor(cansole: Cansole) {
        if (!utils.isCanvas(cansole.element)) {
            throw new Error("CanvasUI.constructor: cansole.element is not an" + " HTMLCanvasElement.");
        }

        this.entities = [];

        cansole.onHide(() => this.destroy());
        cansole.onShow((cansole) => this.init(cansole));
    }

    public init(cansole: Cansole): void {
        const initPos: Vec2<number> = cansole.repository.loadWindowPosition() || DEFAULT_WINDOW_POS;

        const initSize: Vec2<number> = cansole.repository.loadWindowSize() || DEFAULT_WINDOW_SIZE;

        const cansoleWindow = new Window(cansole.element as HTMLCanvasElement, cansole.options.title, {
            x: initPos.v1,
            y: initPos.v2,
            w: initSize.v1,
            h: initSize.v2,
        });

        const submit = new Button(cansole.element as HTMLCanvasElement, "Submit");

        submit.setDisplayName("Submit");

        submit.onClick((e) => {
            console.log("Clicked on", e.target.displayName);
        });

        const input = new TextInput(cansole.element as HTMLCanvasElement, {
            // FIXME: This height should come from a "Container", "Layout",
            // "FlexBox" or whatever that "holds" 2 child (submit and input)
            // and then that "Container" height will get passed to both
            // children, etc. Just like DOM.
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

        // FIXME: instead of this we should have "child" <-> "parent" elements
        // to be "drawn" relative to each other instead of the entire canvas.
        const positionAndResizeElements = () => {
            this.positionSubmitOnWindowResize(submit, cansoleWindow);
            this.positionInputOnWindowResize(input, cansoleWindow);
            this.resizeInputOnWindowReize(input, submit);
        };

        // Need to position and resize the elements on the init as well.
        positionAndResizeElements();

        cansoleWindow.onClose(() => {
            cansole.hide();
        });

        cansoleWindow.onDrag(() => {
            positionAndResizeElements();
        });

        cansoleWindow.onDragEnd((e) => {
            const pos: Vec2<number> = new Vec2(e.target.x, e.target.y);
            cansole.repository.saveWindowPosition(pos);
        });

        cansoleWindow.onResize(() => {
            positionAndResizeElements();
        });

        cansoleWindow.onResizeEnd((e) => {
            const size: Vec2<number> = new Vec2(e.target.w, e.target.h);
            cansole.repository.saveWindowSize(size);
        });
    }

    public draw(): void {
        this.entities.forEach((entity) => entity.draw());
    }

    public destroy(): void {
        this.entities.forEach((entity) => entity.destroy());
        this.entities = [];
    }

    private positionSubmitOnWindowResize(submit: Button, window: Window): void {
        const buttonPaddingWithWindow = 16;

        submit.setR(window.r - buttonPaddingWithWindow);
        submit.setB(window.b - buttonPaddingWithWindow);
    }

    private positionInputOnWindowResize(input: TextInput, window: Window): void {
        const inputPaddingWithWindow = 16;

        input.setL(window.l + inputPaddingWithWindow);
        input.setB(window.b - inputPaddingWithWindow);
    }

    private resizeInputOnWindowReize(input: TextInput, submit: Button) {
        const gapBetweenInputAndSubmit = 16;

        const size = new Vec2(submit.x - input.x - gapBetweenInputAndSubmit, input.h);

        input.setSize(size);
    }
}

export { CanvasUI };
