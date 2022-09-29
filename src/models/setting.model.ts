import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";
import { Text } from "@keystonejs/fields";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class Setting {
    @Field({ type: Text, isUnique: true })
    key: string;
    @Field({ type: Text })
    type: string;
    @Field({ type: Text })
    value: string;
}
