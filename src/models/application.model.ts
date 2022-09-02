import { Keystone } from "@keystonejs/keystone";
import { Checkbox, Select, Text } from "@keystonejs/fields";
import { Role } from "../constants/role.enum";
import { accessHelper } from "../helpers";

export function initApplicationModel(keystone: Keystone): void {
    keystone.createList('Application', {
        fields: {
            platform: { type: Select, options: 'darwin, linux, win32' },
            arch: { type: Select, options: 'arm, arm64, ia32, x64, x32' },
            ext: { type: Text },
            version: { type: Text },
            enable: { type: Checkbox },
            url: { type: Text },
        },
        access: {
            read: accessHelper.access(Role.ADMIN, Role.ANONYMOUS),
            update: accessHelper.access(Role.ADMIN),
            create: accessHelper.access(Role.ADMIN),
            delete: accessHelper.access(Role.ADMIN),
            auth: false,
        },
    });
}
