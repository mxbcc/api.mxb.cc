import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { NeteaseClient } from "../clients";
import { InjectLogger } from "@nestcloud/logger";
import { ConfigService } from "@nestjs/config";
import { PLAYLIST_ID, NETEASE_COOKIE } from "../constants/env.constants";
import { Song } from "../interfaces/song.interface";

@Injectable()
export class NeteaseService {
    private readonly cookie: string;

    constructor(
        private readonly netease: NeteaseClient,
        @InjectLogger()
        private readonly logger: Logger,
        private readonly config: ConfigService,
    ) {
        this.cookie = this.config.get(NETEASE_COOKIE);
    }

    async getLyric(songId: string) {
        const { lrc } = await this.netease.getLyric(songId);
        return { lyric: lrc?.lyric };
    }

    async getSongUrl(songId: string): Promise<{ url: string, size: number }> {
        const { data } = await this.netease.getSongUrl(this.cookie, songId);
        const { url, size } = data[0] ?? {};
        if (!url) {
            throw new NotFoundException();
        }

        // const url = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
        return { url, size };
    }

    async getSongs(): Promise<Song[]> {
        const playlistId = this.config.get(PLAYLIST_ID);
        const { playlist: { tracks } } = await this.netease.getPlaylistDetail(this.cookie, playlistId);
        return tracks.map(item => ({
            songId: String(item.id),
            songName: item.name,
            singerId: String(item?.ar?.[0]?.id),
            singerName: item?.ar?.[0]?.name,
            songPic: item?.al?.picUrl,
            songKind: 'netease',
        }));
    }
}
