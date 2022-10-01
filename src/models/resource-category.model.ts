import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";
import { Select, Text } from "@keystonejs/fields";
import { ResourceCategoryType } from "../enums/resource-category-type.enum";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class ResourceCategory {
    id: string;
    @Field({ type: Text })
    name: string;
    @Field({
        type: Select,
        options: [{ label: '应用', value: 'soft' }, { label: 'PDF', value: 'pdf' }, { label: '其他', value: 'other' }]
    })
    type: ResourceCategoryType;
}
