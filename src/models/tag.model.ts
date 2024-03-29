import { Text, Integer } from "@keystonejs/fields";
import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class Tag {
    @Field({ type: Text })
    key: string;
    @Field({ type: Text })
    name: string;
    @Field({ type: Text, isMultiline: true } as any)
    description: string;
    @Field({ type: Integer })
    sort: number;
}
