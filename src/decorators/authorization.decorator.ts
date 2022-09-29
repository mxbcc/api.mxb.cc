import { applyDecorators, SetMetadata } from "@nestcloud/common";
import { KEYSTONE_MODEL_AUTH } from "../constants/metadata.constants";

export function Authorization(): ClassDecorator {
    return applyDecorators(SetMetadata(KEYSTONE_MODEL_AUTH, true));
}
