import { Cansole } from "./Cansole";

function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

/**
 * Simple object check.
 */
function isObject(item: any): boolean {
    return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 */
function mergeDeep<T>(target: any, ...sources: any[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

// TODO: instead of this we should have "child" <-> "parent" elements to be
// "drawn" relative to each other?
function positionButtonRelativeToWindow(cansole: Cansole): void {
    const renderables = cansole.canvasRenderables;

    // Sanity check because at this moment
    if (!renderables) return;

    const button = renderables.submitButton;
    const window = renderables.window;

    const buttonPaddingWithWindow = 16;

    button.setR(window.box.r - buttonPaddingWithWindow);
    button.setB(window.box.b - buttonPaddingWithWindow);
}

export { isCanvas, positionButtonRelativeToWindow, mergeDeep };
