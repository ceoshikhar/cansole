/**
 * Implement this interface for any type that can have a display name to give
 * types more readable/explanatory names.
 *
 * @example
 * A `Button` instance is not self explanatory as to what button that is or
 * what it does, but giving it a `displayName` of `Login`, it becomes clear
 * that it is a button to login.
 */
interface IDisplayName {
    displayName: string;

    setDisplayName: (name: string) => void;
}

export { IDisplayName };
