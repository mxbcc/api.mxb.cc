import { Checkbox, Relationship, Text, Url } from "@keystonejs/fields";
import { atTracking } from "@keystonejs/list-plugins";
import { Access, Field, Model, UsePlugins } from "../decorators";
import { AccessType, Role } from "../enums";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
@UsePlugins(
    atTracking({
        updatedAtField: 'updatedAt',
        createdAtField: 'createdAt',
        format: 'YYYY-MM-DD hh:mm',
        access: true,
    })
)
export class Comment {
    @Field({ type: Text })
    page: string;
    @Field({ type: Text })
    name: string;
    @Field({ type: Text })
    email: string;
    @Field({ type: Text })
    url: string;
    @Field({ type: Text, isMultiline: true } as any)
    content: string;
    @Field({ type: Relationship, ref: 'Comment', many: false })
    reply_to: Comment;
    @Field({ type: Relationship, ref: 'Comment', many: false })
    belong_to: Comment;
    @Field({ type: Checkbox })
    passed: boolean;
    @Field({ type: Checkbox })
    subscribe: boolean;
}
