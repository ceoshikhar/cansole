import { Vec2 } from "./math";

const WINDOW_POS_KEY = "window_pos";
const WINDOW_SIZE_KEY = "window_size";

type SaveReturn = void;
type LoadReturn<T> = T | null;

class Repository {
    private storage: Storage;

    constructor(strategy: Storage) {
        this.storage = strategy;
    }

    public saveWindowPosition(position: Vec2<number>): SaveReturn {
        this.save(WINDOW_POS_KEY, position);
    }

    public loadWindowPosition(): LoadReturn<Vec2<number>> {
        return this.load(WINDOW_POS_KEY);
    }

    public saveWindowSize(size: Vec2<number>): SaveReturn {
        this.save(WINDOW_SIZE_KEY, size);
    }

    public loadWindowSize(): LoadReturn<Vec2<number>> {
        return this.load(WINDOW_SIZE_KEY);
    }

    private save<V>(key: string, value: V): SaveReturn {
        this.storage.setItem(key, JSON.stringify(value));
    }

    private load<V>(key: string): LoadReturn<V> {
        const valueStr: string | null = this.storage.getItem(key);

        return valueStr === null
            ? null
            : (JSON.parse(valueStr) as unknown as V);
    }
}

export { Repository };
