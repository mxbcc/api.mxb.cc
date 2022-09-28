import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { MusicService } from "../services";
import { Response } from 'express';

@Controller('/nest-api/music')
export class MusicController {
    constructor(
        private readonly musicService: MusicService,
    ) {
    }

    @Get()
    async get(@Query('limit') limit: number) {
        return this.musicService.getSongs(limit);
    }

    @Get('/kinds/:kind/songs/:songId')
    async getSongUrl(
        @Param('kind') kind: string,
        @Param('songId') songId: string,
        @Res() res: Response,
    ) {
        const { url } = await this.musicService.getSongUrl(songId, kind);
        res.redirect(url);
    }

    @Get('/kinds/:kind/songs/:songId/lyric')
    async getLyric(@Param('kind') kind: string, @Param('songId') songId: string) {
        return this.musicService.getLyric(songId, kind);
    }
}
