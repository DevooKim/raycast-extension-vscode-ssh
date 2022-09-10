import { Cache } from "@raycast/api";

class myCache extends Cache {
    constructor(options?: Cache.Options) {
        super(options);
    }

    set(key: string, data: string) {
        if (super.has(key)) {
            console.log(key)
            super.remove(key);
        }
        super.set(key, data);
    }
}

export default myCache;
