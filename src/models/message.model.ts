import { Keystone } from "@keystonejs/keystone";
import { Text } from "@keystonejs/fields";
import { accessHelper } from "../helpers";
import { Role } from "../constants/role.enum";
import { atTracking } from "@keystonejs/list-plugins";

export function initMessageModel(keystone: Keystone): void {
    keystone.createList('Message', {
        fields: {
            name: { type: Text },
            email: { type: Text },
            message: { type: Text, isMultiline: true }
        },
        labelField: 'email',
        plugins: [
            atTracking({
                createdAtField: 'createdAt',
                format: 'YYYY-MM-DD hh:mm',
                access: true,
            }),
        ],
        access: {
            read: accessHelper.access(Role.ADMIN),
            update: accessHelper.access(Role.ADMIN),
            create: accessHelper.access(Role.ADMIN),
            delete: accessHelper.access(Role.ADMIN),
            auth: true,
        },
    } as any);
}
