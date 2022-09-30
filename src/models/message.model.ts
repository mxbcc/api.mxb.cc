import { Text } from "@keystonejs/fields";
import { atTracking } from "@keystonejs/list-plugins";
import { Access, Authorization, Field, Label, Model, UsePlugins } from "../decorators";
import { AccessType, Role } from "../enums";

@Model()
@Access(AccessType.READ, Role.ADMIN)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
@Authorization()
@UsePlugins(
    atTracking({
        createdAtField: 'createdAt',
        format: 'YYYY-MM-DD hh:mm',
        access: true,
    })
)
export class Message {
    @Field({ type: Text })
    name: string;
    @Field({ type: Text })
    @Label()
    email: string;
    @Field({ type: Text, isMultiline: true } as any)
    message: string;
    createdAt: string;
}
