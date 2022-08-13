import * as Utils from "./utils";
import * as Types from "./types";

function getTarget(element: HTMLElement): Types.Target {
    if (Utils.isCanvas(element)) {
        return Types.Target.Canvas;
    }

    return Types.Target.NotCanvas;
}

function create(options: Types.Options): Types.Cansole {
    const { element } = options;

    const target: Types.Target = getTarget(element);
    const visibility: Types.Visibility = Types.Visibility.Hidden;

    const cansole: Types.Cansole = {
        target,
        visibility,
    };

    return cansole;
}

function show(cansole: Types.Cansole): void {
    cansole.visibility = Types.Visibility.Visible;
}

function hide(cansole: Types.Cansole): void {
    cansole.visibility = Types.Visibility.Hidden;
}

function toggle(cansole: Types.Cansole): void {
    if (cansole.visibility === Types.Visibility.Visible) {
        hide(cansole);
    } else {
        show(cansole);
    }
}

export { create, hide, show, toggle };
