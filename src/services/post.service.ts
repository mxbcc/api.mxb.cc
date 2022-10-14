import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectKeystone } from "../decorators";
import { Keystone } from "@keystonejs/keystone";
import { GET_ALL_POSTS } from "../graphql/post.gql";
import { EsService } from "./es.service";
import { EsClient } from "../clients";

@Injectable()
export class PostService implements OnModuleInit {
    constructor(
        @InjectKeystone()
        private readonly keystone: Keystone,
        private readonly esService: EsService,
        private readonly esClient: EsClient,
    ) {
    }


    async search(keyword) {
        const data = await this.esService.searchPost(keyword);
        const fields = await this.esClient.getAnalyzeTokens('ik_smart', keyword);
        const posts = data?.hits?.hits?.map(item => ({
            score: item._score,
            id: item._source.id,
            title: item._source.title,
            desc: item._source.desc,
        }));
        return { posts, fields };
    }

    async syncToEsIndex() {
        const { data } = await this.keystone.executeGraphQL({ query: GET_ALL_POSTS });
        const posts = data.allPosts ?? [];
        await this.esService.createPostIndex(posts);
    }

    onModuleInit(): any {
        setTimeout(() => this.syncToEsIndex(), 5000);
    }
}
