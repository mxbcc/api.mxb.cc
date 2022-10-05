import { Access, Field, Model, UsePlugins } from "../decorators";
import { AccessType, Role } from "../enums";
import { Select, Text, Url, Integer } from "@keystonejs/fields";
import { atTracking } from "@keystonejs/list-plugins";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
@UsePlugins(
    atTracking({
        createdAtField: 'createdAt',
        format: 'YYYY-MM-DD hh:mm',
        access: true,
    })
)
export class ResourcePkg {
    @Field({ type: Url })
    url: string;
    @Field({
        type: Select,
        options: [{ label: '七牛云', value: 'qiniu' }, { label: '百度云', value: 'baidu' }]
    })
    type: string;
    @Field({ type: Text })
    version: string;
    @Field({ type: Integer })
    size: number;
    @Field({ type: Text })
    system: string;
    createdAt: string;
}
