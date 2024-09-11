export const schema = `#graphql
    scalar Timestamp

    type Emote{
        emote_id: ID!
        src: String!
        author: String!
        name: String!
        tags: [String!]!
        likes: Int
        create_at: Timestamp!
        user_liked: Boolean!
    }

    # type EmoteLiked{
    #     emote_id: ID!
    #     src: String!
    # }

    type User {
        create_at: Timestamp!
        email: String!
        emotes_liked: [String!]
        is_admin: Boolean!
        last_login_at: Timestamp!
        password: String!
        username: [String!]!
    }

    union EmoteCollectionDetails = Emote | User
    union UserProfile = User | Emote

    type Query {
        getRecentEmotes: [Emote!]!
        getDetailesEmote(emoteId: ID!, sessionId: ID!): [EmoteCollectionDetails!]!
        getUserProfile(sessionId: ID!): [UserProfile!]!
        getUserLikedEmotes(userEmotesLiked: [String]!): [Emote!]!
    }
`;
