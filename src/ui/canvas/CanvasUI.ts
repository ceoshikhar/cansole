import { Cansole } from "../../Cansole";
import * as utils from "../../utils";

import { Button } from "./Button";
import { Drawable } from "./interfaces/Drawable";
import { Destroyable } from "./interfaces/Destroyable";
import { Window } from "./Window";

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

        // TODO: store windows position and size in LocalStorage ?
        const myWindow = new Window({
            x: 150,
            y: 150,
            w: 640,
            h: 480,
            title: "Cansole",
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

        utils.positionButtonRelativeToWindow(submitButton, myWindow);

        myWindow.onDrag(() =>
            utils.positionButtonRelativeToWindow(submitButton, myWindow)
        );
    }

    public draw(): void {
        this.entities.forEach((entity) => entity.draw());
    }

    public destroy(): void {
        console.log("Destroying CanvasUI");
        this.entities.forEach((entity) => entity.destroy());
        this.entities = [];
    }
}

export { CanvasUI };
