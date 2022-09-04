import { Vec2 } from "../../../math";
import { IRect } from "../interfaces";

type RectOptions = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};

const defaultRectOptions = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
} as const;

class Rect implements IRect {
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    public l: number;
    public t: number;
    public r: number;
    public b: number;

    constructor(options: RectOptions) {
        this.x = options.x || defaultRectOptions.x;
        this.y = options.y || defaultRectOptions.y;
        this.w = options.w || defaultRectOptions.w;
        this.h = options.h || defaultRectOptions.h;

        this.l = this.x;
        this.t = this.y;
        this.r = this.x + this.w;
        this.b = this.y + this.h;
    }

    public setPos(newPos: Vec2<number>): void {
        this.setX(newPos.v1);
        this.setY(newPos.v2);
    }

    public setSize(newSize: Vec2<number>): void {
        this.setW(newSize.v1);
        this.setH(newSize.v2);
    }

    public setX(newX: number): void {
        this.x = newX;
        this.l = newX;
        this.r = newX + this.w;
    }

    public setY(newY: number): void {
        this.y = newY;
        this.t = newY;
        this.b = newY + this.h;
    }

    public setW(newW: number): void {
        this.w = newW;
        this.r = this.x + newW;
    }

    public setH(newH: number): void {
        this.h = newH;
        this.b = this.y + newH;
    }

    public setL(newL: number): void {
        const newR = newL + this.w;

        this.l = newL;
        this.x = newL;
        this.r = newR;
    }

    public setT(newT: number): void {
        const newB = newT + this.h;

        this.t = newT;
        this.y = newT;
        this.b = newB;
    }

    public setR(newR: number): void {
        const newX = newR - this.w;

        this.r = newR;
        this.x = newX;
        this.l = newX;
    }

    public setB(newB: number): void {
        const newY = newB - this.h;

        this.b = newB;
        this.y = newY;
        this.t = newY;
    }

    public contains(point: Vec2<number>): boolean {
        const x = point.v1;
        const y = point.v2;

        if (x >= this.l && x <= this.r && y >= this.t && y <= this.b) {
            return true;
        }

        return false;
    }
}

export { Rect, RectOptions };
