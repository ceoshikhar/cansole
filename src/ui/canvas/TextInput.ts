import * as constants from "../../constants";
import { EventEmitter } from "../../event-emitter";
import * as events from "../../events";
import { Vec2, Vec4 } from "../../math";

import { Rect } from "./shapes";
import { Box } from "./Box";
import {
    IActivable,
    ActiveEventCallback,
    ActiveLostEventCallback,
    IClickable,
    ClickEventCallback,
    IDrawable,
    IDestroyable,
    IDisplayName,
    IHoverable,
    HoverEventCallback,
    HoverLostEventCallback,
    IRect,
    IThemeable,
    Themeables,
} from "./interfaces";
import { Text } from "./Text";

const KeysToIgnoreOnKeyPress = ["Enter"];

type TextInputOptions = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};

const defaultTextInputOptions = {
    x: 0,
    y: 0,
    w: 148,
    h: 22,
} as const;

type TextInputThemeables = Pick<
    Themeables,
    | "backgroundColor"
    | "borderColor"
    | "borderWidth"
    | "cursor"
    | "fontFamily"
    | "fontSize"
    | "fontWeight"
    | "foregroundColor"
    | "padding"
    | "textAlign"
    | "textBaseline"
>;

type TextInputTheme = TextInputThemeables & {
    hover: TextInputThemeables;
    active: TextInputThemeables;
};

type TextInputThemeOptions = Partial<TextInputThemeables> & {
    hover?: Partial<TextInputThemeables>;
    active?: Partial<TextInputThemeables>;
};

const defaultTextInputThemeables: TextInputThemeables = {
    backgroundColor: constants.colors.disabledPrimary,
    borderWidth: 0,
    borderColor: constants.colors.borderPrimaryDisabled,
    cursor: "text",
    fontFamily: "Dank Mono",
    fontSize: 18,
    fontWeight: "normal",
    foregroundColor: constants.colors.onDisabled,
    padding: new Vec4(4, 8, 4, 8),
    textAlign: "start",
    textBaseline: "middle",
};

const defaultTextInputTheme: TextInputTheme = {
    ...defaultTextInputThemeables,

    active: {
        ...defaultTextInputThemeables,
        backgroundColor: "#000000",
        borderColor: constants.colors.primary,
        borderWidth: 2,
        foregroundColor: constants.colors.textPrimary,
    },

    hover: {
        ...defaultTextInputThemeables,
        borderWidth: 2,
    },
};

class TextInput
    implements
        IActivable<TextInput>,
        IClickable<TextInput>,
        IDestroyable,
        IDrawable,
        IDisplayName,
        IHoverable<TextInput>,
        IRect,
        IThemeable<TextInputTheme>
{
    public displayName = "TextInput";
    public theme: TextInputTheme;

    public value = "Shikhar Sharma is an amazing dev! - Shikhar, Sharma";
    /** The part/substring of `value` that is to be drawn in the `box`. */
    private valueVisible: Vec2<number> = new Vec2(0, 0);
    /** The part/substring of `value` that is selected/highlighted. */
    private valueSelected: Vec2<number> | null = null;

    private canvas: HTMLCanvasElement;

    private box: Box;

    private cursor: Box;

    /** Where the cursor is currently present inside the `value`. */
    private cursorIndex = 0;

    private ee: EventEmitter;

    private isActive = false;
    private isDragging = false;
    /** When selection is done via mouse drag and then moved using Shift+ArrowLeft/ArrowRight */
    private haveMovedCursorAfterSelection = false; // Not a fan of this but works for now.

    constructor(canvas: HTMLCanvasElement, options: TextInputOptions = {}, theme: TextInputThemeOptions = {}) {
        this.canvas = canvas;

        this.theme = {
            ...defaultTextInputTheme,
            ...theme,
            hover: {
                ...defaultTextInputTheme.hover,
                ...theme.hover,
            },
            active: {
                ...defaultTextInputTheme.active,
                ...theme.active,
            },
        };

        this.box = new Box(
            canvas,
            {
                x: options.x || defaultTextInputOptions.x,
                y: options.y || defaultTextInputOptions.y,
                w: options.w || defaultTextInputOptions.w,
                h: options.h || defaultTextInputOptions.h,
            },
            {
                backgroundColor: this.theme.backgroundColor,
                borderColor: this.theme.borderColor,
                borderWidth: this.theme.borderWidth,
            }
        );

        this.box.setH(options.h || this.box.h + this.theme.padding.v1 + this.theme.padding.v3);
        this.box.setW(options.w || this.box.w + this.theme.padding.v2 + this.theme.padding.v4);

        //
        // Make this `TextInput` interactive.
        //

        this.ee = new EventEmitter();

        this.makeActivable();
        this.makeHoverable();
        this.makeSelectable();

        this.box.onHover(() => {
            if (this.isActive) {
                this.box.theme = this.theme.active;
            } else {
                this.box.theme = this.theme.hover;
            }

            this.canvas.style.cursor = this.theme.hover.cursor;
        });

        this.box.onHoverLost(() => {
            if (this.isActive) {
                this.box.theme = this.theme.active;
            } else {
                this.box.theme = this.theme;
            }

            this.canvas.style.cursor = "auto";
        });

        this.onActive(() => {
            this.box.theme = this.theme.active;
            this.canvas.style.cursor = this.theme.active.cursor;
        });

        this.onActiveLost(() => {
            if (this.box.isHovered) {
                this.box.theme = this.theme.hover;
                this.canvas.style.cursor = this.theme.hover.cursor;
            } else {
                this.box.theme = this.theme;
                this.canvas.style.cursor = "auto";
            }

            this.moveValueIndexesToStart();
            this.valueSelected = null;
        });

        this.cursor = new Box(
            canvas,
            {},
            {
                backgroundColor: this.theme.active.foregroundColor,
            }
        );
    }

    public setDisplayName(name: string): void {
        this.displayName = name;
    }

    public get x(): number {
        return this.box.x;
    }

    public get y(): number {
        return this.box.y;
    }

    public get w(): number {
        return this.box.w;
    }

    public get h(): number {
        return this.box.h;
    }

    public get l(): number {
        return this.box.l;
    }

    public get t(): number {
        return this.box.t;
    }

    public get r(): number {
        return this.box.r;
    }

    public get b(): number {
        return this.box.b;
    }

    public setPos(newPos: Vec2<number>): void {
        this.box.setPos(newPos);
    }

    public setSize(newSize: Vec2<number>): void {
        this.box.setSize(newSize);
        this.afterWidthChange();
    }

    public setX(newX: number): void {
        this.box.setX(newX);
    }

    public setY(newY: number): void {
        this.box.setY(newY);
    }

    public setW(newW: number): void {
        this.box.setW(newW);
        this.afterWidthChange();
    }

    public setH(newH: number): void {
        this.box.setH(newH);
    }

    public setL(newL: number): void {
        this.box.setL(newL);
    }

    public setT(newT: number): void {
        this.box.setT(newT);
    }

    public setR(newR: number): void {
        this.box.setR(newR);
    }

    public setB(newB: number): void {
        this.box.setB(newB);
    }

    public contains(point: Vec2<number>): boolean {
        return this.box.contains(point);
    }

    private makeHoverable(): void {
        this.box.makeHoverable();

        this.box.onHover(() => {
            this.ee.emit(events.MouseEvents.Hover, { target: this });
        });

        this.box.onHoverLost(() => {
            this.ee.emit(events.MouseEvents.HoverLost, { target: this });
        });
    }

    private makeActivable(): void {
        this.box.makePressable();

        const onKeyPress = (e: KeyboardEvent) => {
            const key = e.key;

            if (KeysToIgnoreOnKeyPress.includes(key)) return;

            if (this.valueSelected) {
                const left = this.value.substring(0, this.valueSelected.v1);
                const right = this.value.substring(this.valueSelected.v2 + 1, this.value.length);

                this.value = left + key + right;
                this.cursorIndex = this.valueSelected.v1 + 1;

                if (!this.isFilledCompletely()) {
                    // The new `value` is not completly filling the text input.
                    // Which means, the `valueVisible` ends with the `value`.
                    this.valueVisible = new Vec2(this.valueVisible.v1, this.value.length);
                }

                this.valueSelected = null;
            } else {
                const left = this.value.substring(0, this.cursorIndex);
                const right = this.value.substring(this.cursorIndex, this.value.length);

                this.value = left + key + right;
                this.cursorIndex += 1;
            }

            if (this.isFilledCompletely()) {
                if (this.cursorIndex >= this.valueVisible.v2) {
                    // Move start and end of `valueVisible` forward.
                    this.valueVisible = this.valueVisible.add(new Vec2(1, 1));
                }
            } else {
                // Move the end of the `valueVisible` forward.
                this.valueVisible = new Vec2(this.valueVisible.v1, this.value.length);
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            const key = e.key;

            switch (key) {
                case "ArrowLeft": {
                    if (e.shiftKey) {
                        if (this.valueSelected) {
                            if (this.haveMovedCursorAfterSelection) {
                                if (this.cursorIndex > 0) {
                                    if (this.cursorIndex === this.valueSelected.v1) {
                                        this.valueSelected = this.valueSelected.sub(new Vec2(1, 0)); // Increase text selection on left.
                                    } else {
                                        this.valueSelected = this.valueSelected.sub(new Vec2(0, 1)); // Decreate text selection on right.
                                    }
                                }

                                // The cursor index should be based off of current cursor index because
                                // the cursor has been moved after doing the selection via mouse drag.
                                this.cursorIndex = Math.max(this.cursorIndex - 1, 0);
                            } else {
                                // The cursor position should be based off of `valueSelected` because
                                // text selection was done via mouse drag and not a previously done similar action.
                                this.cursorIndex = Math.max(this.valueSelected.v1 - 1, 0);
                                this.valueSelected = this.valueSelected.sub(new Vec2(1, 0));
                            }
                        } else {
                            // It would make sense to select text on the left only if we haven't reached the start.
                            if (this.cursorIndex > 0) {
                                this.cursorIndex = this.cursorIndex - 1;
                                this.valueSelected = new Vec2(this.cursorIndex, this.cursorIndex + 1);
                            }
                        }

                        this.haveMovedCursorAfterSelection = true;
                    } else {
                        if (this.valueSelected) {
                            this.cursorIndex = Math.max(this.valueSelected.v1, this.valueVisible.v1);
                            this.valueSelected = null;
                            this.haveMovedCursorAfterSelection = false;
                        } else {
                            this.cursorIndex = Math.max(this.cursorIndex - 1, 0);
                        }
                    }

                    // Cursor is moving past the left most visible character.
                    if (this.cursorIndex < this.valueVisible.v1) {
                        this.valueVisible = this.valueVisible.sub(new Vec2(1, 1));
                    }

                    break;
                }

                case "ArrowRight": {
                    if (e.shiftKey) {
                        if (this.valueSelected) {
                            if (this.haveMovedCursorAfterSelection) {
                                if (this.cursorIndex < this.value.length) {
                                    if (this.cursorIndex === this.valueSelected.v2) {
                                        this.valueSelected = this.valueSelected.add(new Vec2(0, 1)); // Increase text selection on right.
                                    } else {
                                        this.valueSelected = this.valueSelected.add(new Vec2(1, 0)); // Decreate text selection on left.
                                    }
                                }

                                this.cursorIndex = Math.min(this.cursorIndex + 1, this.value.length);
                            } else {
                                this.cursorIndex = Math.max(this.valueSelected.v2 + 1, 0);
                                this.valueSelected = this.valueSelected.add(new Vec2(0, 1));
                            }
                        } else {
                            if (this.cursorIndex < this.value.length) {
                                this.cursorIndex = this.cursorIndex + 1;
                                this.valueSelected = new Vec2(this.cursorIndex - 1, this.cursorIndex);
                            }
                        }

                        this.haveMovedCursorAfterSelection = true;
                    } else {
                        if (this.valueSelected) {
                            this.cursorIndex = Math.min(this.valueSelected.v2, this.valueVisible.v2);
                            this.valueSelected = null;
                            this.haveMovedCursorAfterSelection = false;
                        } else {
                            this.cursorIndex = Math.min(this.cursorIndex + 1, this.value.length);
                        }
                    }

                    // Cursor is moving past the right most visible character.
                    if (this.isFilledCompletely() && this.cursorIndex >= this.valueVisible.v2) {
                        this.valueVisible = this.valueVisible.add(new Vec2(1, 1));
                    }

                    break;
                }

                case "Backspace": {
                    if (this.valueSelected) {
                        const left = this.value.substring(0, this.valueSelected.v1);
                        const right = this.value.substring(this.valueSelected.v2 + 1, this.value.length);

                        this.value = left + right;
                        this.cursorIndex = this.valueSelected.v1;

                        if (!this.isFilledCompletely()) {
                            // The new `value` is not completly filling the text input.
                            // Which means, the `valueVisible` ends with the `value`.
                            this.valueVisible = new Vec2(this.valueVisible.v1, this.value.length);
                        }

                        this.valueSelected = null;
                    } else {
                        const left = this.value.substring(0, this.cursorIndex - 1);
                        const right = this.value.substring(this.cursorIndex, this.value.length);

                        this.value = left + right;

                        this.cursorIndex = Math.max(this.cursorIndex - 1, 0);

                        // Check if the left most character is not in the `valueVisible`.
                        if (this.valueVisible.v1) {
                            this.valueVisible = this.valueVisible.sub(new Vec2(1, 1));
                        }
                    }

                    break;
                }

                default:
                    return;
            }
        };

        this.box.onPress((e) => {
            const x = e.native.offsetX;
            const y = e.native.offsetY;

            this.cursorIndex = this.calculateCursorIndexAt(new Vec2(x, y));
            this.valueSelected = null;

            if (!this.isActive) {
                this.isActive = true;
                this.ee.emit(events.MouseEvents.Active, { target: this });

                document.addEventListener("keypress", onKeyPress);
                document.addEventListener("keydown", onKeyDown);
            }
        });

        this.canvas.addEventListener("mousedown", (e) => {
            // Somewhere on canvas outside this `TextBox`.
            if (!this.box.contains(new Vec2(e.offsetX, e.offsetY))) {
                if (this.isActive) {
                    this.isActive = false;

                    this.ee.emit(events.MouseEvents.ActiveLost, {
                        target: this,
                    });
                    document.removeEventListener("keypress", onKeyPress);
                    document.removeEventListener("keydown", onKeyDown);
                }
            }
        });
    }

    private makeSelectable(): void {
        this.box.makeDraggable();

        this.box.onDrag((e) => {
            if (!this.isActive) return;

            this.isDragging = true;
            this.haveMovedCursorAfterSelection = false;

            const start = this.calculateCursorIndexAt(e.start);
            const curr = this.calculateCursorIndexAt(e.curr);

            if (curr < start) {
                // Text selection going from right to left.
                this.valueSelected = new Vec2(curr, start);
            } else {
                // Text selection going from left to right.
                this.valueSelected = new Vec2(start, curr);
            }
        });

        this.box.onDragEnd(() => {
            if (!this.isActive) return;

            this.isDragging = false;

            if (!this.valueSelected) return;

            if (this.valueSelected.v1 === this.valueSelected.v2) {
                this.valueSelected = null;
            }
        });
    }

    public onActive(cb: ActiveEventCallback<TextInput>): void {
        this.ee.on(events.MouseEvents.Active, cb);
    }

    public onActiveLost(cb: ActiveLostEventCallback<TextInput>): void {
        this.ee.on(events.MouseEvents.ActiveLost, cb);
    }
    public onHover(cb: HoverEventCallback<TextInput>): void {
        this.ee.on(events.MouseEvents.Hover, cb);
    }

    public onHoverLost(cb: HoverLostEventCallback<TextInput>): void {
        this.ee.on(events.MouseEvents.HoverLost, cb);
    }

    public onClick(cb: ClickEventCallback<TextInput>): void {
        this.ee.on(events.MouseEvents.Click, cb);
    }

    public draw(): void {
        //
        // Draw the main box.
        //
        this.box.draw();

        //
        // Draw the typable box and text for the visible value.
        //
        const rect = this.calculateTypableRect();

        const foregroundColor = this.isActive ? this.theme.active.foregroundColor : this.theme.foregroundColor;

        const valueToDraw = this.calculateValueToDraw();

        new Text(
            this.canvas,
            valueToDraw,
            {
                x: rect.x,
                y: rect.y + rect.h / 2,
            },
            {
                foregroundColor,
                textBaseline: this.theme.textBaseline,
            }
        ).draw();

        // Continue drawing if this `TextInput` is active.
        if (!this.isActive) return;

        if (this.valueSelected && (this.valueSelected.v1 || this.valueSelected.v2)) {
            //
            // Draw the text selection.
            //
            const valueSelectedAndVisible = new Vec2(
                Math.max(this.valueVisible.v1, this.valueSelected.v1),
                Math.min(this.valueVisible.v2, this.valueSelected.v2)
            );

            const textWidthLeftOfSelection = new Text(
                this.canvas,
                this.value.substring(this.valueVisible.v1, this.valueSelected.v1)
            ).measureText().width;

            const x = rect.x + textWidthLeftOfSelection;

            const selectedText = new Text(
                this.canvas,
                this.value.substring(
                    valueSelectedAndVisible.v1,
                    // `Math.min` because we are doing `+1` but don't want to
                    // go out of the `valueVisible` range.
                    Math.min(
                        // `+1` to include the index where the selection
                        // started and we selecting towards left.
                        valueSelectedAndVisible.v2 + 1,
                        this.valueVisible.v2
                    )
                ),
                { x, y: rect.y + rect.h / 2 },
                {
                    foregroundColor: this.theme.backgroundColor,
                    textBaseline: this.theme.textBaseline,
                }
            );

            const selectionBox = new Box(
                this.canvas,
                {
                    x,
                    y: this.calculateCursorPosition().v2,
                    h: this.calculateCursorSize().v2,
                    w: selectedText.measureText().width,
                },
                {
                    backgroundColor: this.theme.active.foregroundColor,
                }
            );

            selectionBox.draw();
            selectedText.draw();
        } else {
            //
            // Draw the cursor.
            //
            const pos = this.calculateCursorPosition();

            this.cursor.setX(pos.v1);
            this.cursor.setY(pos.v2);

            const size = this.calculateCursorSize();

            this.cursor.setW(size.v1);
            this.cursor.setH(size.v2);

            this.cursor.draw();

            // Cursor is not at the end so there could be some text under it.
            if (this.cursorIndex < this.value.length) {
                new Text(
                    this.canvas,
                    this.value[this.cursorIndex],
                    {
                        x: this.calculateCursorPosition().v1,
                        y: rect.y + rect.h / 2,
                    },
                    {
                        foregroundColor: this.theme.backgroundColor,
                        textBaseline: this.theme.textBaseline,
                    }
                ).draw();
            }
        }
    }

    public destroy(): void {
        this.ee.emit(events.CoreEvents.Destroy);
    }

    private afterWidthChange(): void {
        this.moveValueIndexesToStart();
    }

    private calculateTypableRect(): Rect {
        return new Rect({
            x: this.box.x + this.theme.padding.v4,
            y: this.box.y + this.theme.padding.v1,
            w: this.box.w - this.theme.padding.v2 - this.theme.padding.v4,
            h: this.box.h - this.theme.padding.v1 - this.theme.padding.v3,
        });
    }

    private calculateCursorPosition(): Vec2<number> {
        const rect = this.calculateTypableRect();
        const valueToDraw = this.calculateValueToDraw();

        const x =
            rect.x +
            new Text(this.canvas, valueToDraw.substring(0, this.cursorIndex - this.valueVisible.v1)).measureText()
                .width;
        const y = rect.y + (rect.b - rect.t - this.theme.fontSize) / 2;

        return new Vec2(x, y);
    }

    private calculateCursorSize(): Vec2<number> {
        const char = this.cursorIndex < this.value.length ? this.value[this.cursorIndex] : "a";

        const width = new Text(this.canvas, char, {}, this.theme).measureText().width;

        return new Vec2(width, this.theme.fontSize);
    }

    private calculateCursorIndexAt(point: Vec2<number>): number {
        if (!this.box.contains(point) && !this.isDragging) {
            throw new Error("The given `point` is not inside of `box`.");
        }

        const rect = this.calculateTypableRect();

        if (!rect.contains(point)) {
            if (point.v1 <= rect.l) {
                return this.valueVisible.v1;
            }

            if (point.v1 >= rect.r) {
                // -1 because for some reason the `valueVisible.v1` lies on the
                // right edge of the `this.box` which is weird.
                return this.valueVisible.v2 - 1;
            }
        }

        let idx = this.valueVisible.v1;

        for (idx; idx < this.value.length; idx++) {
            // Same reasoning for -1 given few lines above.
            if (idx >= this.valueVisible.v2 - 1) break;

            const x1 =
                rect.x + new Text(this.canvas, this.value.substring(this.valueVisible.v1, idx)).measureText().width;

            const x2 =
                rect.x + new Text(this.canvas, this.value.substring(this.valueVisible.v1, idx + 1)).measureText().width;

            // The current cursor index at the point where it was clicked.
            if (x1 <= point.v1 && point.v1 <= x2) {
                idx = Math.min(idx, this.valueVisible.v2);
                break;
            }

            // If we clicked somewhere outside the `valueToDraw`, the cursor
            // index would be at the end.
        }

        return idx;
    }

    private calculateValueToDraw(): string {
        return this.value.substring(this.valueVisible.v1, this.valueVisible.v2);
    }

    private moveValueIndexesToStart(): void {
        const rect = this.calculateTypableRect();
        const paddingR = this.theme.padding.v2;

        let end = 0;

        for (end; end < this.value.length; end++) {
            const textWidth = new Text(this.canvas, this.value.substring(0, end), {}, this.theme).measureText().width;

            if (textWidth + paddingR >= rect.w) {
                break;
            }
        }

        this.valueVisible = new Vec2(0, end);
    }

    private isFilledCompletely(): boolean {
        const rect = this.calculateTypableRect();
        const valueToDraw = this.calculateValueToDraw();

        const textWidth = new Text(this.canvas, valueToDraw, {}, this.theme).measureText().width;

        const paddingR = this.theme.padding.v2;

        // We add the `paddingR` to `textWidth` because we want to move the
        // `valueIndexes` in advance(before) reaching the `rect.w`
        // otherwise, the `cursor` will be drawn at the "outside" of the
        // the "typable" rect's right edge.
        let widthToCheck = textWidth + paddingR;

        // If the `cursor` is at the end of the text, we need to consider
        // it's width as well, otherwise the cursor will go outside.
        if (this.cursorIndex >= this.valueVisible.v2 - 1) {
            const cursorWidth = this.calculateCursorSize().v1;
            widthToCheck += cursorWidth;
        }

        return widthToCheck >= rect.w;
    }
}

export { TextInput };
