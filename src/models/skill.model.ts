import { Keystone } from "@keystonejs/keystone";
import { Relationship, Select, Text } from "@keystonejs/fields";
import { accessHelper } from "../helpers";
import { Role } from "../constants/role.enum";

export function initSkillModel(keystone: Keystone): void {
    keystone.createList('Skill', {
        fields: {
            tag: { type: Relationship, ref: 'Tag', many: false },
            name: { type: Text },
            type: {
                type: Select,
                options: 'Expert, Prefered Stack, Well Understood, Room for Improvement',
                many: true
            },
        },
        access: {
            read: accessHelper.access(Role.ADMIN, Role.ANONYMOUS),
            update: accessHelper.access(Role.ADMIN),
            create: accessHelper.access(Role.ADMIN),
            delete: accessHelper.access(Role.ADMIN),
            auth: false,
        },
    } as any);
}
