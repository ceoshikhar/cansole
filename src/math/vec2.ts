/**
 * Represents a collection of 2 vectors.
 */
type Vec2<T> = [T, T];

function create<T>(x: T, y: T): Vec2<T> {
    return [x, y];
}

export { Vec2, create };
