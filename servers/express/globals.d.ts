export type Emote = {
    emoteId?: string;
    name?: string;
    author?: string;
    src?: string;
    createAt?: string;
    likes?: number;
    tags?: string[];
    user_liked?: boolean;
};

export type User = {
    create_at?: Date;
    email?: string;
    username?: string[];
    password?: string;
    emotes_liked?: string[];
    isAdmin?: boolean;
    last_login_at?: Date;
    sessionId?: string;
    verification_id?: string;
    verified?: boolean;
};
