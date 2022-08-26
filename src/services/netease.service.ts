import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { NeteaseClient } from "../clients";
import { Interval } from "@nestcloud/schedule";
import { InjectLogger } from "@nestcloud/logger";
import { InjectRedis } from "@nestcloud/redis";
import { Redis } from "ioredis";
import { NETEASE_SONG_URL, NETEASE_SONGS } from "../constants/redis.constants";
import * as shuffle from 'shuffle-array';
import { ConfigService } from "@nestjs/config";
import { PLAYLIST_ID, NETEASE_COOKIE } from "../constants/env.constants";

@Injectable()
export class NeteaseService {
    private readonly cookie: string;

    constructor(
        private readonly netease: NeteaseClient,
        @InjectLogger()
        private readonly logger: Logger,
        @InjectRedis()
        private readonly redis: Redis,
        private readonly config: ConfigService,
    ) {
        this.cookie = this.config.get(NETEASE_COOKIE);
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

        const { data } = await this.netease.getSongUrl(this.cookie, songId);
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
        const playlistId = this.config.get(PLAYLIST_ID);
        const { playlist: { tracks } } = await this.netease.getPlaylistDetail(this.cookie, playlistId);
        await this.redis.set(NETEASE_SONGS, JSON.stringify(tracks), 'EX', 60 * 60);
        return tracks;
    }
}
