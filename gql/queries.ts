import { gql } from "graphql-tag";

const GET_RECENT_EMOTES = gql`
    query GetRecentEmotes {
        getRecentEmotes {
            emote_id
            src
        }
    }
`;

const GET_DETAILES_EMOTE = gql`
    query GetDetailesEmote($emoteId: ID!, $sessionId: ID!) {
        getDetailesEmote(emoteId: $emoteId, sessionId: $sessionId) {
            ... on Emote {
                create_at
                name
                author
                src
                likes
                user_liked
            }
            ... on User {
                username
                emotes_liked
            }
        }
    }
`;

const GET_USER_PROFILE = gql`
    query GetUserProfile($sessionId: ID!) {
        getUserProfile(sessionId: $sessionId) {
            ... on User {
                emotes_liked
                username
            }
            ... on Emote {
                src
                emote_id
            }
        }
    }
`;

const GET_USER_LIKED_EMOTES = gql`
    query GetUserLikedEmotes($userEmotesLiked: [String]!) {
        getUserLikedEmotes(userEmotesLiked: $userEmotesLiked) {
            emote_id
            src
        }
    }
`;

export { GET_RECENT_EMOTES, GET_DETAILES_EMOTE, GET_USER_PROFILE, GET_USER_LIKED_EMOTES };
