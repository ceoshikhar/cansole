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
     * Subtracts `otehr` from `this`.
     */
    public sub(other: Vec2<number>): Vec2<number> {
        const v1: number = this.v1 as unknown as number;
        const v2: number = this.v2 as unknown as number;

        return new Vec2(v1 - other.v1, v2 - other.v2);
    }
}

export { Vec2 };
