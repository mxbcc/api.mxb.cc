import { gql } from 'apollo-server-express';

export const LIKE_RESOURCE = gql`
  mutation updateResource($id: ID!, $likes: Int!) {
    updateResource(id: $id, data: {likes: $likes}) {
       id,
    }
  }
`;

export const GET_RESOURCE = gql`
    query getResource($id: ID!) {
        Resource(where: { id: $id }) {
            id,
        }
    }
`;

export const GET_PKG = gql`
    query getDownload($id: ID!) {
        ResourcePkg(where: { id: $id }) {
            url,
        }
    }
`
