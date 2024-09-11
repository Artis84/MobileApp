type Emote = {
    emoteId?: string;
    name?: string;
    author?: string;
    src?: string;
    create_at?: string;
    likes?: number;
    tags?: string[];
    user_liked?: boolean;
    loadingUpload?: (Uploading: boolean) => void;
};

type User = {
    create_at?: Date;
    email?: string;
    username: string[];
    password?: string;
    emotes_liked?: string[];
    isAdmin?: boolean;
    last_login_at?: Date;
    session_id?: string;
    verification_id?: string;
    verified: boolean;
};

type UserProfile = {
    create_at?: Date;
    email?: string;
    username: string[];
    password?: string;
    emotes_liked?: string[];
    last_login_at?: Date;
    session_id?: string;
};
