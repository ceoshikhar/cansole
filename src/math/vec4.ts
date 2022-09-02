/**
 * Represents a collection of 4 values(v1, v2, c3 & v4).
 */
class Vec4<T> {
    public v1: T;
    public v2: T;
    public v3: T;
    public v4: T;

    constructor(v1: T, v2: T, v3: T, v4: T) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.v4 = v4;
    }
}

export { Vec4 };
