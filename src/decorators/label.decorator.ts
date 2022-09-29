import { applyDecorators, ExtendMetadata } from "@nestcloud/common";
import { KEYSTONE_FIELD_LABEL } from "../constants/metadata.constants";

export function Label(): PropertyDecorator {
    return applyDecorators((target, property) => {
        return ExtendMetadata(KEYSTONE_FIELD_LABEL, property)(target, property);
    });
}
