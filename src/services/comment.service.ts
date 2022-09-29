import { Keystone } from "@keystonejs/keystone";
import { Comment } from "../interfaces/comment.interface";
import { createItem } from '@keystonejs/server-side-graphql-client';
import { GET_COMMENT } from "../graphql/comment.gql";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectKeystone } from "../decorators";
import { NotifyService } from "./notify.service";
import { InjectLogger } from "@nestcloud/logger";
import { ConfigService } from "@nestjs/config";
import { EXTERNAL_URL } from "../constants/env.constants";
import { GET_SETTING } from "../graphql/setting.gql";
import { Setting } from "../enums/setting.enum";
import { SettingService } from "./setting.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectKeystone()
        private readonly keystone: Keystone,
        private readonly settingService: SettingService,
        private readonly notifyService: NotifyService,
        @InjectLogger()
        private readonly logger: Logger,
        private readonly config: ConfigService,
    ) {
    }

    async isAdmin(name: string, email: string): Promise<boolean> {
        const adminName = await this.settingService.get(Setting.MXB_ADMIN_NAME);
        const adminEmail = await this.settingService.get(Setting.MXB_ADMIN_EMAIL);
        return name === adminName || email === adminEmail;
    }

    async commit(comment: Comment) {
        const data = {
            page: comment.page,
            name: comment.name,
            email: comment.email,
            url: comment.url,
            content: comment.content,
            subscribe: comment.subscribe,
            reply_to: null,
            belong_to: null,
            passed: true,
        }
        if ((comment.replyTo && !comment.belongTo) || (!comment.replyTo && comment.belongTo)) {
            throw new BadRequestException('Invalid request');
        }

        let replyEmail;
        let replyName;
        let isSubscribe;
        if (comment.replyTo) {
            const res = await this.keystone.executeGraphQL({
                query: GET_COMMENT,
                variables: { id: comment.replyTo, page: comment.page },
            });
            const reply = res.data.Comment;
            data.reply_to = { connect: { id: reply.id } };
            replyEmail = reply.email;
            replyName = reply.name;
            isSubscribe = reply.subscribe;
        }
        if (comment.belongTo) {
            const res = await this.keystone.executeGraphQL({
                query: GET_COMMENT,
                variables: { id: comment.belongTo, page: comment.page },
            });
            data.belong_to = { connect: { id: res.data.Comment.id } };
        }

        const { id } = await createItem({
            keystone: this.keystone,
            listKey: 'Comment',
            item: data
        });

        const externalUrl = this.config.get(EXTERNAL_URL, 'https://mxb.cc');
        if (isSubscribe && replyEmail) {
            this.notifyService.notify(replyEmail, {
                name: replyName,
                content: comment.content,
                url: `${externalUrl}${comment.page}#${comment.replyTo}`
            }).catch(e => {
                this.logger.error(`Notify to ${replyEmail} ${externalUrl}${comment.page}#${comment.replyTo}error.`, e);
            });
        } else if (!isSubscribe && !replyEmail) {
            this.keystone.executeGraphQL({
                query: GET_SETTING,
                variables: { key: Setting.MXB_TITLE },
            }).then(res => {
                const setting = res.data.allSettings[0];
                this.notifyService.notifyMe({
                    content: comment.content,
                    name: setting?.value,
                    url: `${externalUrl}${comment.page}#${id}`
                }).catch(e => {
                    this.logger.error(`Notify to me ${externalUrl}${comment.page}#${comment.replyTo}error.`, e);
                });
            });
        }

        return id;
    }
}
