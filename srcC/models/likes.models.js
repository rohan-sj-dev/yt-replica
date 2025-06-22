import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comments",
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


export const Tweets = mongoose.model("Tweets", userSchema)