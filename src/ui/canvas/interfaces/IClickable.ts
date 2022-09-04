/**
 * The event that is passed to all the listeners for `onClick`.
 */
type ClickEvent<Target> = {
    /** What was clicked. */
    target: Target;
};

/**
 * A callback listener that gets attached to `MouseEvents.Click` event.
 *
 * You will call `onClick` with a callback and it will do the attachment.
 */
type ClickEventCallback<Target> = (e: ClickEvent<Target>) => void;

/**
 * Implement this interface for any type that can be clicked.
 */
interface IClickable<Target = unknown> {
    onClick: (cb: ClickEventCallback<Target>) => void;
}

export { IClickable, ClickEvent, ClickEventCallback };
