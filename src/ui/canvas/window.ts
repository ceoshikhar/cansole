import * as constants from "../../constants";
import * as math from "../../math";
import * as shapes from "./shapes";
import * as types from "../../types";

type Window = {
    pos: math.vec2.Vec2<number>;
    size: math.vec2.Vec2<number>;
    title: string;
};

function create(
    left: number,
    top: number,
    width: number,
    height: number,
    title: string
): Window {
    return {
        pos: math.vec2.create(left, top),
        size: math.vec2.create(width, height),
        title,
    };
}

function render(window: Window, ctx: types.Context2D) {
    const myRect: shapes.rect.Rect = shapes.rect.create({
        x: window.pos[0],
        y: window.pos[1],
        w: window.size[0],
        h: window.size[1],
        bgColor: constants.BG_COLOR,
    });

    shapes.rect.render(myRect, ctx);
}

export { Window, create, render };
