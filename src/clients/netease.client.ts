import { Injectable } from "@nestjs/common";
import {
    login_cellphone,
    login_refresh,
    song_url,
    song_detail,
    playlist_detail,
    lyric,
} from 'NeteaseCloudMusicApi';

@Injectable()
export class NeteaseClient {
    async login(
        phone: string,
        password: string,
        countrycode?: string,
    ): Promise<any> {
        const { body } = await login_cellphone({ phone, countrycode, password });
        return body;
    }

    async refresh(cookie: string): Promise<any> {
        const { body } = await login_refresh({ cookie });
        return body;
    }

    async getSongUrl(cookie: string, id: string): Promise<any> {
        const { body } = await song_url({ id, cookie });
        return body;
    }

    async getSongsDetail(cookie: string, ids: string): Promise<any> {
        const { body } = await song_detail({ ids, cookie });
        return body;
    }

    async getPlaylistDetail(cookie: string, id: string): Promise<any> {
        const { body } = await playlist_detail({ id, cookie });
        return body;
    }

    async getLyric(id: string): Promise<any> {
        const { body } = await lyric({ id });
        return body;
    }
}
