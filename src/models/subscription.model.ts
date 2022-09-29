import { Text } from "@keystonejs/fields";
import { Access, Authorization, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";

@Model('EmailSubscription')
@Access(AccessType.READ, Role.ADMIN)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
@Authorization()
export class Subscription {
    @Field({ type: Text })
    email: string;
}
