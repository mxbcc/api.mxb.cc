import { gql } from 'apollo-server-express';

export const GET_SETTING = gql`
    query getSetting($key: String!) {
        allSettings(where: { key: $key }) {
            key,
            type,
            value,
        }
    }
`;

export const GET_SETTINGS = gql`
    query getSettings($type: String!) {
        allSettings(where: { type: $type }) {
            key,
            type,
            value,
        }
    }
`;
