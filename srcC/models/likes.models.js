import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweets"
    }
    
},
{timestamps: true}
)


export const Likes = mongoose.model("Likes", userSchema)