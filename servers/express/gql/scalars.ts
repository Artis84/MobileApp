import { GraphQLScalarType } from "graphql";

const TimestampType = new GraphQLScalarType({
    name: "Timestamp",
    description: "Custom scalar for converting timestamps into seconds",
    serialize(timestamp: any) {
        const isoDate = timestamp.toDate().toISOString();
        return isoDate;
    },
});

export const Timestamp = TimestampType;
