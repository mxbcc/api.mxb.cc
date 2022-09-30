import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";
import { Select, Text, Url, Integer } from "@keystonejs/fields";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
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
}
