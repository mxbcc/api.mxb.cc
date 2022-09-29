export class Reflector {
    get<T extends any>(key: string, target: Function | Function[], targetKey?: string | symbol): T {
        let targets = [];
        (Array.isArray(target) ? target : [target]).forEach(item => {
            targets = targets.concat([item, item.constructor, item.prototype]);
        });

        for (let i = 0; i < targets.length; i++) {
            if (!targets[i]) {
                continue;
            }
            const metadata = Reflect.getMetadata(key, targets[i], targetKey);
            if (metadata) {
                return metadata;
            }
        }
        return void 0;
    }
}

export const reflector = new Reflector();
