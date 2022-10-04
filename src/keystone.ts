import { PasswordAuthStrategy } from "@keystonejs/auth-password";
import { AllFieldsOptions, Keystone } from '@keystonejs/keystone';
import { GraphQLApp } from '@keystonejs/app-graphql';
import { MongooseAdapter } from '@keystonejs/adapter-mongoose';
import * as models from "./models";
import { AdminUIApp } from "@keystonejs/app-admin-ui";
import * as expressSession from 'express-session';
import * as initMongoStore from 'connect-mongo';
import { ConfigService } from "@nestjs/config";
import {
    ALI_ACCESS_KEY, ALI_BUCKET, ALI_REGION,
    ALI_SECRET_KEY,
    COOKIE_DOMAIN,
    MONGO_URI,
    SESSION_STORE, UPLOAD_FOLDERS
} from "./constants/env.constants";
import { OSSAdapterClient } from "./clients/oss-adapter.client";
import {
    KEYSTONE_FIELD_LABEL,
    KEYSTONE_FIELD_OPTIONS,
    KEYSTONE_MODEL,
    KEYSTONE_MODEL_ACCESS,
    KEYSTONE_MODEL_AUTH, KEYSTONE_MODEL_PLUGINS
} from "./constants/metadata.constants";
import { reflector } from "./reflector";
import { File } from "@keystonejs/fields";
import { accessHelper } from "./helpers";

export const initKeystone = (config: ConfigService) => {
    const MongoStore = initMongoStore(expressSession);
    const mongoUri = config.get(MONGO_URI, 'localhost:27017');
    const sessionStore = config.get(SESSION_STORE, 'memory');
    const keystone = new Keystone({
        adapter: new MongooseAdapter({ mongoUri: config.get(MONGO_URI) }),
        cookieSecret: 'mxb.cc',
        cookie: {
            domain: config.get(COOKIE_DOMAIN),
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            sameSite: false,
        } as any,
        sessionStore: sessionStore === 'mongo' ? new MongoStore({ url: mongoUri }) : undefined,
    });

    const ossAdapter = new OSSAdapterClient(
        config.get(ALI_ACCESS_KEY),
        config.get(ALI_SECRET_KEY),
        config.get(ALI_REGION),
        config.get(ALI_BUCKET),
        config.get(UPLOAD_FOLDERS),
    );

    Object.values(models).forEach(model => {
        const modelName = reflector.get<string>(KEYSTONE_MODEL, model);
        if (!modelName) {
            return;
        }
        const metaAccesses = reflector.get<any[]>(KEYSTONE_MODEL_ACCESS, model);
        const auth = reflector.get<boolean>(KEYSTONE_MODEL_AUTH, model) ?? false;
        const labels = reflector.get(KEYSTONE_FIELD_LABEL, model) ?? [];
        const metaFields = reflector.get<{ property: string, options: AllFieldsOptions }[]>(KEYSTONE_FIELD_OPTIONS, model);
        const plugins = reflector.get(KEYSTONE_MODEL_PLUGINS, model) ?? [];

        const fields = {};
        metaFields.forEach(({ property, options }) => {
            if ((options.type as any).type === 'File') {
                (options as any).adapter = ossAdapter;
            }
            fields[property] = options;
        });

        const access = { auth };
        metaAccesses?.forEach(({ type, roles }) => access[type] = accessHelper.access(...roles));

        keystone.createList(typeof modelName === 'string' ? modelName : model.name, {
            fields,
            access,
            plugins,
            labelField: labels[0],
        } as any);
    });

    const executeGraphQL = keystone.executeGraphQL.bind(keystone);
    const context = keystone.createContext({ skipAccessControl: true })
    // @ts-ignore
    keystone.executeGraphQL = async (params: { context?: any; query?: any, variables?: any }) => {
        const result = await executeGraphQL({ context, ...params });
        if ((result as any).errors) {
            throw (result as any).errors[0];
        }
        return result;
    };

    const authStrategy = keystone.createAuthStrategy({
        type: PasswordAuthStrategy,
        list: 'User',
    });
    const apps = [
        new GraphQLApp({ apiPath: '/api' }),
        new AdminUIApp({
            adminPath: '/admin',
            apiPath: '/api',
            enableDefaultRoute: false,
            authStrategy,
        }),
    ];
    return { keystone, apps };
}
