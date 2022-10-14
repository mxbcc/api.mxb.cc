import { emailSender } from '@keystonejs/email';
import { EmailAttachment } from "../interfaces";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { SettingService } from "../services/setting.service";
import { Setting } from "../enums/setting.enum";
import { InjectLogger } from "@nestcloud/logger";

@Injectable()
export class EmailClient {
    constructor(
        @Inject(SettingService)
        private readonly settingService: SettingService,
        @InjectLogger()
        private readonly logger: Logger,
    ) {
    }

    public async send<T extends any>(tpl: string, to: string | string[], title: string, data: T, attachments?: EmailAttachment[]) {
        if (!(await this.settingService.enable(Setting.MXB_EMAIL_ENABLE))) {
            this.logger.warn(`please config the email at first`);
            return false;
        }

        const jsxEmailSender = emailSender.jsx({
            root: `${__dirname}/../templates`,
            transport: 'nodemailer',
        });

        const { config, from } = await this.getEmailConfig();

        await jsxEmailSender(tpl).send(data, {
            nodemailerConfig: config,
            attachments,
            subject: title,
            to: typeof to === "string" ? to : to.join(','),
            from,
        });
    }

    private async getEmailConfig() {
        const config = {
            host: await this.settingService.get(Setting.MXB_EMAIL_HOST),
            port: await this.settingService.get(Setting.MXB_EMAIL_PORT),
            secure: await this.settingService.get(Setting.MXB_EMAIL_SECURE) === 'true',
            auth: {
                user: await this.settingService.get(Setting.MXB_EMAIL_USER),
                pass: await this.settingService.get(Setting.MXB_EMAIL_PASS),
                name: await this.settingService.get(Setting.MXB_EMAIL_TITLE),
            },
        };

        const from = {
            name: await this.settingService.get(Setting.MXB_EMAIL_TITLE),
            email: await this.settingService.get(Setting.MXB_EMAIL_USER),
        };

        return { config, from };
    }
}
