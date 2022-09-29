import { Password, Select, Text } from "@keystonejs/fields";
import { Access, Authorization, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";

@Model()
@Access(AccessType.READ, Role.ADMIN)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
@Authorization()
export class User {
    @Field({ type: Text })
    name: string;
    @Field({ type: Text, isUnique: true })
    email: string;
    @Field({ type: Select, options: `${Role.ADMIN}` })
    role: Role;
    @Field({ type: Password })
    password: string;
}
