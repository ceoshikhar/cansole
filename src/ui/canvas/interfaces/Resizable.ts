import { Vec2 } from "../../../math";

/**
 * The event that is passed to all the listeners for `onResize`.
 */
type ResizeEvent<Target> = {
    diff: Vec2<number>;
    delta: Vec2<number>;
    end: Vec2<number>;
    start: Vec2<number>;
    /** What was resized. */
    target: Target;
};

/**
 * A callback listener that gets attached to `WindowEvents.Resize` event.
 *
 * You will call `onResize` with a callback and it will do the attachment.
 */
type ResizeEventCallback<Target> = (e: ResizeEvent<Target>) => void;

/**
 * Implement this interface for any type that can be resized.
 */
interface Resizable<Target = unknown> {
    onResize: (cb: ResizeEventCallback<Target>) => void;

    onResizeEnd: (cb: ResizeEventCallback<Target>) => void;

    onResizeStart: (cb: ResizeEventCallback<Target>) => void;
}

export { Resizable, ResizeEvent, ResizeEventCallback };
