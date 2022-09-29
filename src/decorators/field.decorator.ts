import { applyDecorators, ExtendMetadata } from "@nestcloud/common";
import { KEYSTONE_FIELD_OPTIONS} from "../constants/metadata.constants";
import { AllFieldsOptions } from "@keystonejs/keystone";

export function Field(options: AllFieldsOptions): PropertyDecorator {
    return applyDecorators((target, property) => {
        return ExtendMetadata(KEYSTONE_FIELD_OPTIONS, {
            property,
            options,
        })(target, property);
    });
}
