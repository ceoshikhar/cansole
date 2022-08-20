type ClickEvent<Target> = {
    target: Target;
};

type ClickEventCallback<Target> = (e: ClickEvent<Target>) => void;

interface Clickable<Target = unknown> {
    onClick: (cb: ClickEventCallback<Target>) => void;
}

export { Clickable, ClickEvent, ClickEventCallback };
