# Specs

This is the specifications for [Cansole](https://github.com/ceoshikhar/cansole).

## `Cansole`

Represents a `Cansole`.

```ts
type Cansole {
    element: CansoleElement;
    target: Target,
    visibility: Visibility,
}
```

## Target

Where and how to render the `Cansole`.

**NOTE:** Currently `Cansole` supports only `Target.Canvas`.

```ts
enum Target {
    /**
     * Renders using `<canvas>`.
     */
    Canvas = "Canvas",

    /**
     * Render using other HTML elements like `<div>`, `<button>`, `<input>` and etc.
     */
    NotCanvas = "NotCanvas",
}
```

## Visibility

Whether `Cansole` is currently visible or hidden.

```ts
enum Visibility {
    /**
     * Show the `Cansole`.
     */
    Visible = "Visible",

    /**
     * Hide the `Cansole`.
     */
    Hidden = "Hidden",
}
```
