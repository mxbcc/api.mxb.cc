import { File, Text, Url } from "@keystonejs/fields";
import { AccessType, Role } from "../enums";
import { Access, Field, Model } from "../decorators";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class SiteMeta {
    @Field({ type: Text })
    title: string;
    @Field({ type: Text })
    keywords: string;
    @Field({ type: Text })
    description: string;
    @Field({ type: Url })
    icp: string;
    @Field({ type: Text })
    icp_url: string;
    @Field({ type: File, label: 'avatar' })
    avatar: any;
    @Field({ type: File, label: 'avatar background' })
    avatar_background: any;
    @Field({ type: File, label: 'qrcode' })
    qrcode: any;
    @Field({ type: Text })
    admin_name: string;
    @Field({ type: Text })
    admin_email: string;
    @Field({ type: Text })
    address: string;
    @Field({ type: Text, isMultiline: true } as any)
    header_script: string;
}
