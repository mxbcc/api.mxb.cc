import { Injectable } from "@nestjs/common";
import { Keystone } from "@keystonejs/keystone";
import { InjectKeystone } from "../decorators";
import * as RSS from 'rss';
import { GET_POSTS } from "../graphql/post.gql";
import { EXTERNAL_URL } from "../constants/env.constants";
import { ConfigService } from "@nestjs/config";
import { Post } from "../models";
import { SettingService } from "./setting.service";
import { Setting } from "../enums/setting.enum";

@Injectable()
export class RssService {
    constructor(
        @InjectKeystone()
        private readonly keystone: Keystone,
        private readonly settingService: SettingService,
        private readonly config: ConfigService,
    ) {
    }

    async getRSS() {
        const title = await this.settingService.get(Setting.MXB_TITLE);
        const description = await this.settingService.get(Setting.MXB_DESCRIPTION);
        const avatar = await this.settingService.get(Setting.MXB_AVATAR);
        const adminEmail = await this.settingService.get(Setting.MXB_ADMIN_EMAIL);
        const externalUrl = this.config.get(EXTERNAL_URL, 'https://mxb.cc');
        const feed = new RSS({
            title,
            description,
            feed_url: `${externalUrl}/rss.xml`,
            site_url: externalUrl,
            image_url: avatar,
            managingEditor: adminEmail,
            webMaster: adminEmail,
            copyright: `${new Date().getFullYear()} ${title}`,
            language: 'zh',
            ttl: '60',
        });
        const res = await this.keystone.executeGraphQL({ query: GET_POSTS, variables: { skip: 0, first: 10 } });
        const posts = res.data.allPosts as Post[];
        posts.forEach(post => feed.item({
            title: post.title,
            description: post.description,
            url: `${externalUrl}/posts/${post.key}`,
            author: title,
            date: post.createdAt,
        }));

        return feed.xml();
    }
}
