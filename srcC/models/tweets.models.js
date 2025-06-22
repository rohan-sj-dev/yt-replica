import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
},
{timestamps: true}
)


export const Tweets = mongoose.model("Tweets", userSchema)