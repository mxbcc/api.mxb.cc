import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectLogger } from "@nestcloud/logger";
import { SingClient } from "../clients";
import { createHash } from 'crypto';
import { InjectRedis } from "@nestcloud/redis";
import { Redis } from 'ioredis';
import { SING_TOKEN, SING_USER_ID } from "../constants/redis.constants";
import { ConfigService } from "@nestjs/config";
import { SING_PASSWORD, SING_USERNAME } from "../constants/env.constants";
import { Song } from "../interfaces/song.interface";

@Injectable()
export class SingService implements OnModuleInit {
    private readonly SIGN_KEY = '5SING_KUGOU';

    constructor(
        private readonly singClient: SingClient,
        @InjectLogger()
        private readonly logger: Logger,
        @InjectRedis()
        private readonly redis: Redis,
        private readonly config: ConfigService,
    ) {
    }

    async getLyric(songId: string, kind: string) {
        const { data: { dynamicWords } } = await this.singClient.getSong(songId, kind);
        return { lyric: dynamicWords };
    }

    async getSongUrl(songId: string, kind: string): Promise<{ url: string, size: number }> {
        const { data, success } = await this.singClient.getSongUrl(songId, kind);
        if (!success) {
            throw new NotFoundException();
        }
        const url = data?.squrl ?? data?.hqurl ?? data?.lqurl;
        const size = data?.sqsize ?? data?.hqsize ?? data?.lqsize;
        if (!url) {
            throw new NotFoundException();
        }
        return { url, size };
    }

    async getSongs(): Promise<Song[]> {
        const userId = await this.redis.get(SING_USER_ID);
        const token = await this.redis.get(SING_TOKEN);
        const { data } = await this.singClient.getLoveSongs(userId, token);
        return (data ?? []).map(item => ({
            songId: String(item.ID),
            songName: item.SN,
            singerId: String(item?.user?.ID),
            singerName: item?.user?.NN,
            songPic: item?.user?.I,
            songKind: item?.SK,
        }));
    }

    async onModuleInit(): Promise<void> {
        const md5 = createHash('md5');
        const username = this.config.get(SING_USERNAME);
        const password = this.config.get(SING_PASSWORD);
        const sign = md5.update(`${username}${this.SIGN_KEY}${password}`).digest('hex');

        const token = await this.redis.get(SING_TOKEN);
        if (!token) {
            try {
                const { data, code, msg } = await this.singClient.login(username, password, sign);
                if (code !== 0) {
                    this.logger.error(`init 5sing api error: ${JSON.stringify(msg)}`);
                    return;
                }
                await this.redis.set(SING_USER_ID, data.userid);
                await this.redis.set(SING_TOKEN, data.sign);
            } catch (e) {
                this.logger.error(`init 5sing api error`, e);
            }
        }
    }
}
