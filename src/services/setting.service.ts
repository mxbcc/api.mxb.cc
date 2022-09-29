import { Keystone } from "@keystonejs/keystone";
import { Injectable } from "@nestjs/common";
import { InjectKeystone } from "../decorators";
import { GET_SETTING } from "../graphql/setting.gql";
import { Setting } from "../enums/setting.enum";

@Injectable()
export class SettingService {
    constructor(
        @InjectKeystone()
        private readonly keystone: Keystone,
    ) {
    }

    async get(key: Setting, defaultValue?: any) {
        const res = await this.keystone.executeGraphQL({
            query: GET_SETTING,
            variables: { key },
        });
        return res.data.allSettings?.[0]?.value ?? defaultValue;
    }
}
