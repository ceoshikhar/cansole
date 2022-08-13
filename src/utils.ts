function isCanvas(element: HTMLElement): element is HTMLCanvasElement {
    return element instanceof HTMLCanvasElement;
}

export { isCanvas }
