/**
 * The event that is passed to all the listeners for `onActive`.
 */
type ActiveEvent<Target> = {
    /** What was activated. */
    target: Target;
};

/**
 * A callback listener that gets attached to `Events.Active` event.
 *
 * You will call `onActive` with a callback and it will do the attachment.
 */
type ActiveEventCallback<Target> = (e: ActiveEvent<Target>) => void;

/**
 * The event that is passed to all the listeners for `onActiveLost`.
 */
type ActiveLostEvent<Target> = {
    /** What lost the active. */
    target: Target;
};

/**
 * A callback listener that gets attached to `Events.ActiveLost` event.
 *
 * You will call `onActiveLost` with a callback and it will do the attachment.
 */
type ActiveLostEventCallback<Target> = (e: ActiveLostEvent<Target>) => void;

/**
 * Implement this interface for any type that can be activated.
 */
interface Activable<Target = unknown> {
    onActive: (cb: ActiveEventCallback<Target>) => void;

    onActiveLost: (cb: ActiveLostEventCallback<Target>) => void;
}

export {
    Activable,
    ActiveEvent,
    ActiveEventCallback,
    ActiveLostEvent,
    ActiveLostEventCallback,
};
