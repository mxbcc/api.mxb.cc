import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { NeteaseClient } from "../clients";
import { Interval } from "@nestcloud/schedule";
import { InjectLogger } from "@nestcloud/logger";
import { InjectRedis } from "@nestcloud/redis";
import { Redis } from "ioredis";
import { NETEASE_SONG_URL, NETEASE_SONGS } from "../constants/redis.constants";
import * as shuffle from 'shuffle-array';
import { SettingService } from "./setting.service";
import { Setting } from "../enums/setting.enum";

@Injectable()
export class NeteaseService {
    constructor(
        private readonly netease: NeteaseClient,
        @InjectLogger()
        private readonly logger: Logger,
        @InjectRedis()
        private readonly redis: Redis,
        private readonly settingService: SettingService,
    ) {
    }

    async getLyric(songId: string) {
        const { lrc } = await this.netease.getLyric(songId);
        return { lyric: lrc?.lyric };
    }

    async getSongUrl(songId: string): Promise<{ url: string, size: number }> {
        let cache = await this.redis.get(`${NETEASE_SONG_URL}:${songId}`);
        if (cache) {
            return JSON.parse(cache);
        }

        const cookie = await this.settingService.get(Setting.MXB_NETEASE_COOKIE);
        const { data } = await this.netease.getSongUrl(cookie, songId);
        const { url, size } = data[0] ?? {};
        if (!url) {
            throw new NotFoundException();
        }
        await this.redis.set(
            `${NETEASE_SONG_URL}:${songId}`,
            JSON.stringify({ url, size }),
            'EX',
            60 * 60 * 24,
        );

        // const url = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
        return { url, size };
    }

    async getSongs() {
        const cache = await this.redis.get(NETEASE_SONGS);
        let songs = [];
        if (cache) {
            songs = JSON.parse(cache);
        } else {
            songs = await this.refreshSongs();
        }

        shuffle(songs);
        return songs;
    }

    @Interval(5 * 60 * 1000)
    async refreshSongs() {
        const playlistId = await this.settingService.get(Setting.MXB_NETEASE_PLAYLIST_ID);
        const cookie = await this.settingService.get(Setting.MXB_NETEASE_COOKIE);
        const { playlist: { tracks } } = await this.netease.getPlaylistDetail(cookie, playlistId);
        await this.redis.set(NETEASE_SONGS, JSON.stringify(tracks), 'EX', 60 * 60);
        return tracks;
    }
}
