/**
 * The event that is passed to all the listeners for `onHover`.
 */
type HoverEvent<Target> = {
    /** What was hovered. */
    target: Target;
};

/**
 * A callback listener that gets attached to `MouseEvents.Hover` event.
 *
 * You will call `onHover` with a callback and it will do the attachment.
 */
type HoverEventCallback<Target> = (e: HoverEvent<Target>) => void;

/**
 * The event that is passed to all the listeners for `onHoverLost`.
 */
type HoverLostEvent<Target> = {
    /** What lost the hover. */
    target: Target;
};

/**
 * A callback listener that gets attached to `MouseEvents.HoverLost` event.
 *
 * You will call `onHoverLost` with a callback and it will do the attachment.
 */
type HoverLostEventCallback<Target> = (e: HoverLostEvent<Target>) => void;

/**
 * Implement this interface for any type that can be hovered.
 */
interface Hoverable<Target = unknown> {
    onHover: (cb: HoverEventCallback<Target>) => void;

    onHoverLost: (cb: HoverLostEventCallback<Target>) => void;
}

export {
    Hoverable,
    HoverEvent,
    HoverEventCallback,
    HoverLostEvent,
    HoverLostEventCallback
};
