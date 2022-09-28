import { Keystone } from "@keystonejs/keystone";
import { Integer, Select, Text, Url } from "@keystonejs/fields";
import { Role } from "../constants/role.enum";
import { accessHelper } from "../helpers";

export function initSongModel(keystone: Keystone): void {
    keystone.createList('Song', {
        fields: {
            songId: { type: Text },
            songName: { type: Text },
            singerId: { type: Text },
            singerName: { type: Text },
            songPic: { type: Url },
            songKind: { type: Select, options: 'yc, fc, bz, netease' },
            songUrl: { type: Url },
            songUrlTime: { type: Integer },
            songSize: { type: Integer },
            lyric: { type: Text },
        },
        access: {
            read: accessHelper.access(Role.ADMIN, Role.ANONYMOUS),
            update: accessHelper.access(Role.ADMIN),
            create: accessHelper.access(Role.ADMIN),
            delete: accessHelper.access(Role.ADMIN),
            auth: false,
        },
    });
}
