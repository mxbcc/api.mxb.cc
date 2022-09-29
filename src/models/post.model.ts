import { Checkbox, File, Relationship, Text, Url } from "@keystonejs/fields";
import { Wysiwyg } from "@keystonejs/fields-wysiwyg-tinymce";
import { Markdown } from '@keystonejs/fields-markdown';
import { atTracking } from "@keystonejs/list-plugins";
import { Access, Field, Label, Model, UsePlugins } from "../decorators";
import { AccessType, Role } from "../enums";
import { Tag } from "./tag.model";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
@UsePlugins(
    atTracking({
        updatedAtField: 'updatedAt',
        createdAtField: 'createdAt',
        format: 'YYYY-MM-DD hh:mm',
        access: true,
    })
)
export class Post {
    id: string;
    @Field({ type: Text })
    key: string;
    @Field({ type: Text })
    @Label()
    title: string;
    @Field({ type: Relationship, ref: 'Tag', many: true })
    tags: Tag[];
    @Field({ type: Text })
    keywords: string;
    @Field({ type: Text, isMultiline: true } as any)
    description: string;
    @Field({ type: File, label: '缩略图' })
    thumb: { publicUrl: string };
    @Field({ type: File, label: '封面图' })
    cover: { publicUrl: string }
    @Field({ type: Markdown })
    content: string;
    @Field({ type: Wysiwyg })
    html_content: string;
    @Field({ type: Checkbox, label: '发布' })
    publish: boolean;
    @Field({ type: Checkbox, label: '置顶' })
    top: boolean;
    @Field({ type: Text, label: '来源' })
    source: string;
    @Field({ type: Url })
    source_url: string;
    createdAt: string;
    updatedAt: string;
}
