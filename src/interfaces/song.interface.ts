export interface Song {
    songId: string;
    songName: string;
    singerId: string;
    singerName: string;
    songPic: string;
    songKind: string;
    songUrl?: string;
    songUrlTime?: number;
    lyric?: string;
    songSize?: number;
}
