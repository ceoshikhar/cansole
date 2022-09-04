import { Vec2 } from "../../../math";

/**
 * The event that is passed to all the listeners for `onDrag`.
 */
type DragEvent<Target> = {
    diff: Vec2<number>;
    delta: Vec2<number>;
    end: Vec2<number>;
    start: Vec2<number>;
    /** What was dragged. */
    target: Target;
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
interface IDraggable<Target = unknown> {
    onDrag: (cb: DragEventCallback<Target>) => void;

    onDragEnd: (cb: DragEventCallback<Target>) => void;

    onDragStart: (cb: DragEventCallback<Target>) => void;
}

export { IDraggable, DragEvent, DragEventCallback };
