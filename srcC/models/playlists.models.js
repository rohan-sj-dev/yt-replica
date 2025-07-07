import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    description: {
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


export const Playlists = mongoose.model("Playlists", userSchema)