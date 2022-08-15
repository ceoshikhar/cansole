/**
 * Represents a collection of 2 vectors.
 */
type Vec2<T> = [T, T];

function create<T>(x: T, y: T): Vec2<T> {
    return [x, y];
}

/**
 * Subtract `what` from `from`.
 *
 * sub(from, what) = from - what
 */
function sub(from: Vec2<number>, what: Vec2<number>): Vec2<number> {
    return [from[0] - what[0], from[1] - what[1]];
}

export { Vec2, create, sub };
