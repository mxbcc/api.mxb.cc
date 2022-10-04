import { Keystone } from "@keystonejs/keystone";
import { createItems } from '@keystonejs/server-side-graphql-client';
import { ContactMessage, NotificationMessage } from "../interfaces";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectKeystone } from "../decorators";
import { EmailClient } from "../clients";
import { InjectLogger } from "@nestcloud/logger";
import { SettingService } from "./setting.service";
import { Setting } from "../enums/setting.enum";

const NOTIFICATION_EMAIL_TITLE = '[Notification] You have an unread reply on mxb.cc';
const CONTACT_ME_EMAIL_TITLE = '[Notification] Someone contact you on mxb.cc';

@Injectable()
export class NotifyService {
    constructor(
        private readonly settingService: SettingService,
        @InjectKeystone()
        private readonly keystone: Keystone,
        private readonly email: EmailClient,
        @InjectLogger()
        private readonly logger: Logger,
    ) {
    }

    public async sendMessage(data: ContactMessage) {
        await createItems({
            keystone: this.keystone,
            listKey: 'Message',
            items: [{ data }],
        });
        const adminEmail = await this.settingService.get(Setting.MXB_ADMIN_EMAIL);
        const title = await this.settingService.get(Setting.MXB_TITLE);
        if (!adminEmail) {
            throw new BadRequestException('Send message error, Please contact the administrator');
        }
        this.email.send<any>(
            'contact-me.template.js',
            adminEmail,
            CONTACT_ME_EMAIL_TITLE,
            { ...data, title },
        ).catch(e => {
            this.logger.error(`send contact me email error: ${JSON.stringify(data)}.`, e);
        });
    }

    public async notify(emailAddress: string, data: NotificationMessage) {
        return this.email.send<NotificationMessage>('notification.template.js', emailAddress, NOTIFICATION_EMAIL_TITLE, data);
    }

    public async notifyMe(data: NotificationMessage) {
        const adminEmail = await this.settingService.get(Setting.MXB_ADMIN_EMAIL);
        if (!adminEmail) {
            throw new BadRequestException('Send message error, Please contact the administrator');
        }
        return this.email.send<NotificationMessage>('notification.template.js', adminEmail, NOTIFICATION_EMAIL_TITLE, data);
    }
}
