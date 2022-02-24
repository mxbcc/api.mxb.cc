import { Keystone } from "@keystonejs/keystone";
import { Relationship, Text } from "@keystonejs/fields";
import { accessHelper } from "../helpers";
import { Role } from "../constants/role.enum";

export function initSkillModel(keystone: Keystone): void {
    keystone.createList('EmailSubscription', {
        fields: {
            tag: { type: Relationship, ref: 'Tag', many: false },
            name: { type: Text },
        },
        access: {
            read: accessHelper.access(Role.ANONYMOUS),
            update: accessHelper.access(Role.ADMIN),
            create: accessHelper.access(Role.ADMIN),
            delete: accessHelper.access(Role.ADMIN),
            auth: false,
        },
    } as any);
}
