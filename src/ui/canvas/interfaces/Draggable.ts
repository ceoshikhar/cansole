import * as math from "../../../math";

/**
 * The event that is passed to all the listeners for `onDrag`.
 */
type DragEvent<Target> = {
    /** What was dragged. */
    target: Target;
    deltaTotal: math.vec2.Vec2<number>;
    deltaMovement: math.vec2.Vec2<number>;
};

/**
 * A callback listener that gets attached to `MouseEvents.Drag` event.
 *
 * You will call `onDrag` with a callback and it will do the attachment.
 */
type DragEventCallback<Target> = (e: DragEvent<Target>) => void;

/**
 * Implement this interface for any type that can be dragged.
 */
interface Draggable<Target = unknown> {
    onDrag: (cb: DragEventCallback<Target>) => void;
}

export { Draggable, DragEvent, DragEventCallback };
