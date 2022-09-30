import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";
import { File } from "@keystonejs/fields";
import { FileModel } from "../interfaces";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class ResourceImage {
    @Field({ type: File })
    image: FileModel;
}
