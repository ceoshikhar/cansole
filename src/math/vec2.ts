/**
 * Represents a collection of 2 values(v1 & v2).
 */
class Vec2<T> {
    public v1: T;
    public v2: T;

    constructor(v1: T, v2: T) {
        this.v1 = v1;
        this.v2 = v2;
    }

    /**
     * Adds `other` to `this`.
     */
    public add(other: Vec2<number>): Vec2<number> {
        if (typeof this.v1 !== "number" || typeof this.v2 !== "number") {
            throw new Error("Vec2: `add` method is only for Vec2<number>.");
        }

        const v1: number = this.v1;
        const v2: number = this.v2;

        return new Vec2(v1 + other.v1, v2 + other.v2);
    }

    /**
     * Subtracts `other` from `this`.
     */
    public sub(other: Vec2<number>): Vec2<number> {
        if (typeof this.v1 !== "number" || typeof this.v2 !== "number") {
            throw new Error("Vec2: `add` method is only for Vec2<number>.");
        }

        const v1: number = this.v1;
        const v2: number = this.v2;

        return new Vec2(v1 - other.v1, v2 - other.v2);
    }
}

export { Vec2 };
