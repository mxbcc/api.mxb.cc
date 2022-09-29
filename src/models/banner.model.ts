import { Text } from "@keystonejs/fields";
import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class Banner {
    @Field({ type: Text })
    key: string;
    @Field({ type: Text })
    title: string;
    @Field({ type: Text, isMultiline: true } as any)
    content: string;
}
