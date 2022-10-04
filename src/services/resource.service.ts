import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectKeystone } from "../decorators";
import { updateItem, getItem } from '@keystonejs/server-side-graphql-client';
import { Keystone } from "@keystonejs/keystone";
import { InjectRedis } from "@nestcloud/redis";
import { Redis } from "ioredis";
import { RESOURCE_LIKES } from "../constants/redis.constants";
import { Resource } from "../models";
import { GET_PKG, GET_RESOURCE, LIKE_RESOURCE } from "../graphql/resource.gql";
import { InjectLogger } from "@nestcloud/logger";

@Injectable()
export class ResourceService {
    constructor(
        @InjectKeystone()
        private readonly keystone: Keystone,
        @InjectRedis()
        private readonly redis: Redis,
        @InjectLogger()
        private readonly logger: Logger,
    ) {
    }

    async likeResource(id: string) {
        const { data } = await this.keystone.executeGraphQL({ query: GET_RESOURCE, variables: { id } });
        if (!data.Resource) {
            throw new NotFoundException();
        }
        const likes = await this.redis.incr(`${RESOURCE_LIKES}_${id}`);
        try {
            await this.keystone.executeGraphQL({ query: LIKE_RESOURCE, variables: { id, likes } });
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async getPackage(id: string) {
        try {
            const { data } = await this.keystone.executeGraphQL({ query: GET_PKG, variables: { id } });
            const url = data.ResourcePkg.url;
            if (!url) {
                throw new Error('ths url is empty');
            }

            return url;
        } catch (e) {
            this.logger.error(`get resource package error by id ${id}`, e);
            throw new BadRequestException('获取资源下载地址失败，请稍候重试');
        }
    }
}
