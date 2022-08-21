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

// @ts-ignore
// I don't know why TypeScript can't understand that I want a generic T that
// extends `Themeables` and I want everything inside of T to be present inside
// `Theme` hence the `extends T` and use the same T for `hover` and `active`.
// I think error is incorrect and it works fine where used rest time will tell.
interface Theme<T extends Themeables> extends T {
    active: T;

    hover: T;
}

interface Themeable<T extends Themeables> {
    theme: Theme<T>;
}

export { Themeable, Theme, Themeables };
