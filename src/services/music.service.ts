import { NeteaseService } from "./netease.service";
import { SingService } from "./sing.service";
import * as shuffle from 'shuffle-array';
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { randomHelper } from "../helpers";
import { InjectKeystone } from "../decorators/inject-keystone.decorator";
import { Keystone } from "@keystonejs/keystone";
import { GET_SONG, GET_SONGS } from "../graphql/song.gql";
import { createItem } from "@keystonejs/server-side-graphql-client";
import { InjectLogger } from "@nestcloud/logger";
import { Cron } from "@nestcloud/schedule";

@Injectable()
export class MusicService implements OnApplicationBootstrap {
    constructor(
        @InjectKeystone()
        private readonly keystone: Keystone,
        private readonly neteaseService: NeteaseService,
        private readonly singService: SingService,
        @InjectLogger()
        private readonly logger: Logger,
    ) {
    }

    async getSongs(limit = 10) {
        const res = await this.keystone.executeGraphQL({
            query: GET_SONGS,
        });

        const songs = res.data.allSongs ?? [];
        shuffle(songs);
        return {
            total: songs.length,
            tracks: randomHelper.getRandomArrayElements(songs, limit),
        };
    }

    async getSongUrl(songId: string, songKind: string): Promise<{ url: string, size: number }> {
        const res = await this.keystone.executeGraphQL({
            query: GET_SONG,
            variables: { songId: String(songId), songKind },
        });
        const song = res.data.allSongs?.[0];
        return { url: song?.url, size: song?.size };
    }

    async getLyric(songId: string, songKind: string) {
        const res = await this.keystone.executeGraphQL({
            query: GET_SONG,
            variables: { songId: String(songId), songKind },
        });
        const song = res.data.allSongs?.[0];
        return { lyric: song.lyric };
    }

    @Cron('')
    async sync() {
        await this.syncSongs();
        await this.syncSingSongs();
    }

    async onApplicationBootstrap() {
        setTimeout(async () => {
            await this.syncSongs();
            await this.syncSingSongs();
        }, 3000);
    }

    private async syncSongs() {
        const songs = await this.neteaseService.getSongs();
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const res = await this.keystone.executeGraphQL({
                query: GET_SONG,
                variables: { songId: String(song.songId), songKind: song.songKind },
            });
            if (!res.data.allSongs) {
                try {
                    const { url, size } = await this.neteaseService.getSongUrl(song.songId);
                    song.songUrl = url;
                    song.songSize = size;
                } catch (e) {
                    this.logger.error(`load netease song ${song.songId} url fail`, e);
                }

                try {
                    const { lyric } = await this.neteaseService.getLyric(song.songId);
                    song.lyric = lyric;
                } catch (e) {
                    this.logger.error(`load netease song ${song.songId} lyric fail`, e);
                }

                await createItem({ keystone: this.keystone, listKey: 'Song', item: song });
                this.logger.log(`synced netease song ${song.songId} succeed`);
            }
        }
    }

    private async syncSingSongs() {
        const songs = await this.singService.getSongs();
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const res = await this.keystone.executeGraphQL({
                query: GET_SONG,
                variables: { songId: String(song.songId), songKind: song.songKind },
            });
            if (!res.data.allSongs) {
                try {
                    const { url, size } = await this.singService.getSongUrl(song.songId, song.songKind);
                    song.songUrl = url;
                    song.songSize = size;
                } catch (e) {
                    this.logger.error(`load 5sing song ${song.songId} url fail`, e);
                }

                try {
                    const { lyric } = await this.singService.getLyric(song.songId, song.songKind);
                    song.lyric = lyric;
                } catch (e) {
                    this.logger.error(`load 5sing song ${song.songId} lyric fail`, e);
                }

                await createItem({ keystone: this.keystone, listKey: 'Song', item: song });
                this.logger.log(`synced 5sing song ${song.songId} succeed`);
            }
        }
    }
}
