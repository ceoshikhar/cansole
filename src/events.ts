enum CoreEvents {
    Destroy = "Destroy",
}

enum CansoleEvents {
    Hide = "Hide",
    Show = "Show",
}

enum MouseEvents {
    Active = "Active",
    ActiveLost = "ActiveLost",
    Click = "Click",
    Drag = "Drag",
    DragEnd = "DragEnd",
    DragStart = "DragStart",
    Hover = "Hover",
    HoverLost = "HoverLost",
}

enum WindowEvents {
    Resize = "Resize",
    ResizeEnd = "ResizeEnd",
    ResizeStart = "ResizeStart",
}

export { CansoleEvents, CoreEvents, MouseEvents, WindowEvents };
