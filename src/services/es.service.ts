import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { EsClient } from "../clients";
import { InjectLogger } from "@nestcloud/logger";
import { Post } from "../models";
import * as dayjs from "dayjs";

@Injectable()
export class EsService implements OnModuleInit {
    private readonly POST_INDEX = 'es_index_post_v1';

    constructor(
        private readonly esClient: EsClient,
        @InjectLogger()
        private readonly logger: Logger,
    ) {
    }

    async searchPost(keyword: string) {
        const params = {
            _source: {
                include: ['id', 'title', 'desc'],
            },
            query: {
                bool: {
                    should: [
                        ...this.buildQuery('title', 'ik_smart', 10, keyword),
                        ...this.buildQuery('title_py', 'pinyin', 10, keyword),
                        ...this.buildQuery('desc', 'ik_smart', 5, keyword),
                        ...this.buildQuery('desc_py', 'pinyin', 5, keyword),
                        ...this.buildQuery('content', 'ik_smart', 1, keyword),
                        ...this.buildQuery('content_py', 'pinyin', 1, keyword),
                        ...this.buildQuery('numbers', 'standard', 1, keyword),
                    ]
                }
            }
        };

        return this.esClient.search(this.POST_INDEX, params);
    }

    async createPostIndex(posts: Post[]) {
        try {
            await this.esClient.bulkCreate(this.POST_INDEX, posts.map(item => ({
                id: item.id,
                title: item.title,
                title_py: item.title,
                desc: item.description,
                desc_py: item.description,
                content: item.content,
                content_py: item.content,
                updated_at: dayjs(item.updatedAt).unix(),
                numbers: this.filterNumbers(`${item.title}|${item.description}|${item.content}`),
            })));
        } catch (e) {
            this.logger.error(`create post es index error`, e);
        }
    }

    async createPostEsMapping() {
        const mapping = {
            settings: {
                index: {
                    max_ngram_diff: 15,
                    analysis: {
                        analyzer: {
                            comma: {
                                type: 'pattern',
                                pattern: ','
                            },
                            number_analyzer: {
                                type: 'custom',
                                tokenizer: 'standard',
                                filter: [
                                    'lowercase',
                                    'my_ngram',
                                    'trim'
                                ]
                            },
                        },
                        filter: {
                            my_ngram: {
                                type: 'ngram',
                                min_gram: 2,
                                max_gram: 15
                            }
                        },
                    },
                },
            },
            mappings: {
                topic: {
                    properties: {
                        id: {
                            type: 'text',
                        },
                        title: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_smart',
                        },
                        title_py: {
                            type: 'text',
                            analyzer: 'pinyin',
                            search_analyzer: 'pinyin',
                        },
                        desc: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_smart',
                        },
                        desc_py: {
                            type: 'text',
                            analyzer: 'pinyin',
                            search_analyzer: 'pinyin',
                        },
                        content: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_smart',
                        },
                        content_py: {
                            type: 'text',
                            analyzer: 'pinyin',
                            search_analyzer: 'pinyin',
                        },
                        updated_at: {
                            type: 'long',
                        },
                        numbers: {
                            type: 'text',
                            analyzer: 'number_analyzer',
                            search_analyzer: 'standard'
                        },
                    },
                },
            },
        };

        await this.esClient.createMapping(this.POST_INDEX, mapping);
    }

    async onModuleInit() {
        try {
            await this.esClient.isExists(this.POST_INDEX);
        } catch (e) {
            try {
                await this.createPostEsMapping();
            } catch (e) {
                this.logger.error(`create es mapping ${this.POST_INDEX} error`, e);
            }
        }

        this.logger.log(`init es-mapping done`);
    }

    private filterNumbers(content: string): number[] {
        const reg = /[0-9]+/g;
        const result = [];
        let res = [];
        while (res) {
            res = reg.exec(content);
            if (res) {
                result.push(Number(res[0]));
            }
        }
        return result;
    };

    private buildQuery(field: string, analyzer: string, boost: number, keyword: string) {
        return [
            {
                match: {
                    [field]: {
                        query: keyword,
                        boost,
                        analyzer,
                    },
                }
            },
            {
                match_phrase: {
                    [field]: {
                        query: keyword,
                        boost,
                        analyzer,
                    },
                }
            },
        ]
    }
}
