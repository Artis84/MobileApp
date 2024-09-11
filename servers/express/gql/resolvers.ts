import { DocumentData, collection, getDocs, query, where } from "@firebase/firestore/lite";
import Db from "../DataBase";
import { Emote, User } from "../globals.d";

const db = new Db();

export const resolvers = {
    Query: {
        getRecentEmotes: async () => {
            const emotesRef = collection(db.db, "emotes");
            const emotesSnapshot = await getDocs(emotesRef);

            const emotes: DocumentData = [];
            emotesSnapshot.forEach((doc) => {
                emotes.push(doc.data());
            });

            return emotes;
        },

        getDetailesEmote: async (_: any, { emoteId, sessionId }: { emoteId: string; sessionId: string }) => {
            const usersRef = collection(db.db, "users");
            const emotesRef = collection(db.db, "emotes");
            const usersSnapshot = await getDocs(query(usersRef, where("session_id", "==", sessionId)));
            const emotesSnapshot = await getDocs(query(emotesRef, where("emote_id", "==", emoteId)));

            const userDoc = usersSnapshot.docs[0];
            const emoteDoc = emotesSnapshot.docs[0];
            const emoteData: Emote = emoteDoc.data();
            const userData: User = userDoc.data();

            const emoteLiked = userData.emotes_liked;
            const isEmoteLiked = emoteLiked!.includes(emoteId);
            emoteData.user_liked = isEmoteLiked;

            const emoteDetails = [emoteData, userData];
            return emoteDetails;
        },

        getUserLikedEmotes: async (_: any, { userEmotesLiked }: { userEmotesLiked: string[] }) => {
            const emotesRef = collection(db.db, "emotes");
            const emotesSnapshot = await getDocs(query(emotesRef, where("emote_id", "in", userEmotesLiked)));

            const emotesLikedDoc = emotesSnapshot.docs[0];
            const emotesLikedData: Emote = emotesLikedDoc.data();

            const emoteDetails = [emotesLikedData];
            return emoteDetails;
        },

        getUserProfile: async (_: any, { sessionId }: { sessionId: string }) => {
            const usersRef = collection(db.db, "users");
            const emotesRef = collection(db.db, "emotes");

            const usersSnapshot = await getDocs(query(usersRef, where("session_id", "==", sessionId)));
            const userDoc = usersSnapshot.docs[0];
            const userData: User = userDoc.data();
            const username = userData.username![0];

            const userEmotesSnapshot = await getDocs(query(emotesRef, where("author", "==", username)));
            if (!userEmotesSnapshot.empty) {
                // const userEmotesDoc = userEmotesSnapshot.docs[0];
                // const userEmotesData: Emote = userEmotesDoc.data();

                // const userEmotesData: DocumentData = [];
                const userProfile = [userData];
                userEmotesSnapshot.forEach((doc) => {
                    userProfile.push(doc.data());
                });
                // console.log(userProfile);

                return userProfile;
            } else {
                const userDoc = usersSnapshot.docs[0];
                const userData: User = userDoc.data();

                const userProfile = [userData];
                return userProfile;
            }
        },
    },
    EmoteCollectionDetails: {
        __resolveType: (obj: any) => {
            if (obj.hasOwnProperty("emote_id")) {
                return "Emote";
            } else if (obj.hasOwnProperty("emotes_liked")) {
                return "User";
            }
            return null;
        },
    },
    UserProfile: {
        __resolveType: (obj: any) => {
            console.log(obj);
            if (obj.hasOwnProperty("username") && !obj.hasOwnProperty("emote_id")) return "User";
            else return "Emote";
        },
    },
};
