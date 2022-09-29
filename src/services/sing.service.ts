import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectLogger } from "@nestcloud/logger";
import { SingClient } from "../clients";
import { createHash } from 'crypto';
import { InjectRedis } from "@nestcloud/redis";
import { Redis } from 'ioredis';
import {
    SING_LOVE_SONGS,
    SING_SONG_URL,
} from "../constants/redis.constants";
import * as shuffle from 'shuffle-array';
import { SettingService } from "./setting.service";
import { Setting } from "../enums/setting.enum";

@Injectable()
export class SingService {
    private readonly SIGN_KEY = '5SING_KUGOU';

    constructor(
        private readonly singClient: SingClient,
        @InjectLogger()
        private readonly logger: Logger,
        @InjectRedis()
        private readonly redis: Redis,
        private readonly settingService: SettingService,
    ) {
    }

    async getLyric(songId: string, kind: string) {
        const { data: { dynamicWords } } = await this.singClient.getSong(songId, kind);
        return { lyric: dynamicWords };
    }

    async getSongUrl(songId: string, kind: string): Promise<{ url: string, size: number }> {
        let cache = await this.redis.get(`${SING_SONG_URL}:${kind}:${songId}`);
        if (cache) {
            return JSON.parse(cache);
        }
        const { data, success } = await this.singClient.getSongUrl(songId, kind);
        if (!success) {
            throw new NotFoundException();
        }
        const url = data?.squrl ?? data?.hqurl ?? data?.lqurl;
        const size = data?.sqsize ?? data?.hqsize ?? data?.lqsize;
        if (!url) {
            throw new NotFoundException();
        }
        await this.redis.set(
            `${SING_SONG_URL}:${kind}:${songId}`,
            JSON.stringify({ url, size }),
            'EX',
            60 * 60 * 24,
        );
        return { url, size };
    }

    async getSongs() {
        const cache = await this.redis.get(SING_LOVE_SONGS);
        let songs: any[] = [];
        if (cache) {
            songs = JSON.parse(cache);
        } else {
            songs = await this.refreshSongs();
        }
        shuffle(songs);
        return songs;
    }

    async refreshSongs() {
        const userId = await this.settingService.get(Setting.MXB_5SING_USERID);
        const token = await this.settingService.get(Setting.MXB_5SING_TOKEN);
        const { data } = await this.singClient.getLoveSongs(userId, token);
        const songs = (data ?? []).map(item => ({
            id: item.ID,
            name: item.SN,
            ar: [{
                id: item?.user?.ID,
                name: item?.user?.NN,
            }],
            al: {
                id: item?.user?.ID,
                name: item?.user?.NN,
                picUrl: item?.user?.I,
            },
            kind: item.SK,
        }));
        await this.redis.set(SING_LOVE_SONGS, JSON.stringify(songs), 'EX', 60 * 60 * 24);
        return songs;
    }

    async getToken() {
        const md5 = createHash('md5');
        const username = await this.settingService.get(Setting.MXB_5SING_USERNAME);
        const password = await this.settingService.get(Setting.MXB_5SING_PASSWORD);
        const sign = md5.update(`${username}${this.SIGN_KEY}${password}`).digest('hex');

        try {
            const { data, code, msg } = await this.singClient.login(username, password, sign);
            if (code !== 0) {
                this.logger.error(`get 5sing token error: ${JSON.stringify(msg)}`);
                return;
            }

            return { userId: data.userid, token: data.sign };
        } catch (e) {
            this.logger.error(`get 5sing token error`, e);
            throw e;
        }
    }
}
