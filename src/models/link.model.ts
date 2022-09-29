import { Checkbox, Relationship, Text, Url, Select, File } from "@keystonejs/fields";
import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";
import { Tag } from "./tag.model";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class Link {
    @Field({ type: Text })
    name: string;
    @Field({ type: Url })
    url: string;
    @Field({ type: Text, isMultiline: true } as any)
    description: string;
    @Field({ type: File, label: '头像' })
    avatar: any;
    @Field({ type: Relationship, ref: 'Tag', many: true })
    tags: Tag[];
    @Field({ type: Select, options: 'global, inner' })
    type: string;
    @Field({ type: Checkbox })
    enable: boolean;
}
