import { File, Text, Checkbox, Integer, Url } from "@keystonejs/fields";
import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class Gallery {
    @Field({ type: Text })
    title: string;
    @Field({ type: Text })
    description: string;
    @Field({ type: File, label: '背景' })
    thumb: any;
    @Field({ type: File, label: 'Icon' })
    cover: any;
    @Field({ type: Integer })
    sort: number;
    @Field({ type: Url })
    url: string;
    @Field({ type: Checkbox, label: '发布' })
    public: boolean;
}
