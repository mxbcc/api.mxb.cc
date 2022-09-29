import { Relationship, Select, Text } from "@keystonejs/fields";
import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";
import { Tag } from "./tag.model";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class Skill {
    @Field({ type: Relationship, ref: 'Tag', many: false })
    tag: Tag;
    @Field({ type: Text })
    name: string;
    @Field({
        type: Select,
        options: 'EXPERT, PREFERED_STACK, WELL_UNDERSTOOD, ROOM_FOR_IMPROVEMENT',
        many: true
    })
    type: string[];
}
