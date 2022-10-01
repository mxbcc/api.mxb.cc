import { Access, Field, Model, UsePlugins } from "../decorators";
import { AccessType, ResourceLanguage, ResourcePlatform, ResourceType, Role } from "../enums";
import { atTracking } from "@keystonejs/list-plugins";
import { Checkbox, File, Integer, Relationship, Select, Text } from "@keystonejs/fields";
import { Wysiwyg } from "@keystonejs/fields-wysiwyg-tinymce";
import { ResourceImage } from "./resource-image.model";
import { ResourcePkg } from "./resource-pkg.model";
import { ResourceCategory } from "./resource-category.model";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
@UsePlugins(
    atTracking({
        createdAtField: 'createdAt',
        format: 'YYYY-MM-DD hh:mm',
        access: true,
    })
)
export class Resource {
    id: string;
    @Field({ type: Text })
    name: string;
    @Field({ type: Text })
    description: string;
    @Field({ type: Wysiwyg })
    content: string;
    @Field({ type: File })
    icon: File;
    @Field({
        type: Select,
        dataType: 'string',
        options: [
            { label: '中文', value: 'zh-cn' },
            { label: '英文', value: 'en-us' },
            { label: '其他', value: 'other' },
        ],
    } as any)
    language: ResourceLanguage;
    @Field({
        type: Select,
        dataType: 'string',
        options: [
            { label: 'Apple M1', value: 'apple_m1' },
            { label: 'Apple Intel', value: 'apple_intel' },
            { label: 'Windows', value: 'windows' },
            { label: 'Ubuntu', value: 'ubuntu' },
        ],
        many: true,
    } as any)
    platform: ResourcePlatform[];
    @Field({
        type: Select,
        dataType: 'string',
        options: [
            { label: '官方版', value: 'normal' },
            { label: '破解版', value: 'crack' },
            { label: '开源版', value: 'open_source' },
        ],
    } as any)
    type: ResourceType;
    @Field({ type: Relationship, ref: 'ResourceImage', many: true })
    images: ResourceImage[];
    @Field({ type: Relationship, ref: 'ResourcePkg', many: true })
    packages: ResourcePkg[];
    @Field({ type: Relationship, ref: 'ResourceCategory', many: true })
    categories: ResourceCategory[];
    @Field({ type: Integer })
    downloads: number;
    @Field({ type: Integer })
    likes: number;
    @Field({ type: Checkbox })
    recommend: boolean;
    @Field({ type: Checkbox })
    enable: boolean;
    createdAt: string;
}
