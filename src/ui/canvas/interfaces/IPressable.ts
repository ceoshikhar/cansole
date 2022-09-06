/**
 * The event that is passed to all the listeners for `onPress`.
 */
type PressEvent<Target> = {
    /** Native DOM event that triggered this event. */
    native: MouseEvent;
    /** What was pressed. */
    target: Target;
};

/**
 * A callback listener that gets attached to `MouseEvents.Press` event.
 *
 * You will call `onPress` with a callback and it will do the attachment.
 */
type PressEventCallback<Target> = (e: PressEvent<Target>) => void;

/**
 * Implement this interface for any type that can be pressed.
 */
interface IPressable<Target = unknown> {
    onPress: (cb: PressEventCallback<Target>) => void;

    onPressLost: (cb: PressEventCallback<Target>) => void;
}

export { IPressable, PressEvent, PressEventCallback };
