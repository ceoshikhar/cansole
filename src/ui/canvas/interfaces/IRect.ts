import { Vec2 } from "../../../math";

interface IRect {
    x: number;
    y: number;
    w: number;
    h: number;

    l: number;
    t: number;
    r: number;
    b: number;

    setPos: (newPos: Vec2<number>) => void;
    setSize: (newSize: Vec2<number>) => void;

    setX: (newX: number) => void;
    setY: (newY: number) => void;
    setW: (newW: number) => void;
    setH: (newH: number) => void;

    setL: (newL: number) => void;
    setT: (newT: number) => void;
    setR: (newR: number) => void;
    setB: (newB: number) => void;

    contains: (point: Vec2<number>) => boolean;
}

export { IRect };
