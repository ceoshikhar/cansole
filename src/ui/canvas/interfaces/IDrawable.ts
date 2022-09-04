/**
 * Implement this interface for any type that can be drawn.
 *
 * We don't care where it's being drawn at but `draw` will draw it.
 *
 * For our use-case in s8ly we are drawing to an `HTMLCanvasElement`.
 */
interface IDrawable {
    draw: () => void;
}

export { IDrawable };
