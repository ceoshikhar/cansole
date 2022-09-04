import { Vec4 } from "../../../math";

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
    padding: Vec4<number>;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
};

interface IThemeable<T> {
    theme: T;
}

export { IThemeable, Themeables };
