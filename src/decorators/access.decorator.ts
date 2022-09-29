import { applyDecorators, ExtendMetadata } from "@nestcloud/common";
import { KEYSTONE_MODEL_ACCESS } from "../constants/metadata.constants";
import { AccessType, Role } from "../enums";

export function Access(type: AccessType, ...roles: Role[]): ClassDecorator {
    return applyDecorators(
        ExtendMetadata(KEYSTONE_MODEL_ACCESS, { type, roles }),
    );
}
