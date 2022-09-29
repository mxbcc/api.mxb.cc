import { applyDecorators, SetMetadata } from "@nestcloud/common";
import { KEYSTONE_MODEL_PLUGINS } from "../constants/metadata.constants";

export function UsePlugins(...plugins): ClassDecorator {
    return applyDecorators(SetMetadata(KEYSTONE_MODEL_PLUGINS, plugins));
}
