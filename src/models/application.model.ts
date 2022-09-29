import { Checkbox, Select, Text } from "@keystonejs/fields";
import { Access, Field, Model } from "../decorators";
import { AccessType, Role } from "../enums";

@Model()
@Access(AccessType.READ, Role.ADMIN, Role.ANONYMOUS)
@Access(AccessType.UPDATE, Role.ADMIN)
@Access(AccessType.DELETE, Role.ADMIN)
@Access(AccessType.CREATE, Role.ADMIN)
export class Application {
    @Field({ type: Select, options: 'darwin, linux, win32' })
    platform: string;
    @Field({ type: Select, options: 'arm, arm64, ia32, x64, x32' })
    arch: string;
    @Field({ type: Text })
    ext: string;
    @Field({ type: Checkbox })
    enable: boolean;
    @Field({ type: Text })
    url: string;
}
