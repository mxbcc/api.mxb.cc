import { applyDecorators, SetMetadata } from "@nestcloud/common";
import { KEYSTONE_MODEL } from "../constants/metadata.constants";

export function Model(name?: string): ClassDecorator {
    return applyDecorators(SetMetadata(KEYSTONE_MODEL, name ?? true));
}
