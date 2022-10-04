declare module "@keystonejs/server-side-graphql-client" {
    import { Keystone } from "@keystonejs/keystone";

    export function createItems(options: {
        keystone: Keystone;
        listKey: string;
        items: { data: any }[];
    }): any;

    export function createItem(options: {
        keystone: Keystone;
        listKey: string;
        item: any;
    }): any;

    export function getItem(options: {
        keystone: Keystone;
        listKey: string;
        itemId: string;
        returnFields?: string;
    });

    export function getItems(options: {
        keystone: Keystone;
        listKey: string;
        where: any;
        sortBy: string;
        first: number;
        skip: number,
        pageSize?: number;
        returnFields?: string;
    });

    export function updateItem (options: {
        keystone: Keystone;
        listKey: string;
        item: any;
        returnFields?: string;
    });

    export function updateItems(options: {
        keystone: Keystone;
        listKey: string;
        items: any[];
        pageSize?: number;
        returnFields?: string;
    });

    export function deleteItem(options: {
        keystone: Keystone;
        listKey: string;
        itemId: string;
        returnFields?: string;
    });
}
