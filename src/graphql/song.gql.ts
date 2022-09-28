import { gql } from 'apollo-server-express';

export const GET_SONG = gql`
query getSongs($songId: String!, $songKind: SongSongKindType!) {
  allSongs(where: {songId: $songId, songKind: $songKind}) {
    songId,
    songName,
    singerId,
    singerName,
    songPic,
    songKind,
    songUrl,
    songSize,
    songUrlTime,
    lyric,
  }
}
`;

export const GET_SONGS = gql`
query getSongs() {
  allSongs() {
    songId,
    songName,
    singerId,
    singerName,
    songPic,
    songKind,
    songUrl,
    songSize,
    songUrlTime,
    lyric,
  }
}
`;
