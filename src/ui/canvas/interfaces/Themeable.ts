/**
 * Themeables that you can pick to compose your own <T> to pass to Themeable:
 */
type Themeables = {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    cursor: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: "normal" | "bold"; // TODO: better typing, any more variants?
    foregroundColor: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
};

interface Themeable<T> {
    theme: T;
}

export { Themeable, Themeables };
