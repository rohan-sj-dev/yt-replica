import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const userSchema = new Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbanail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
},
{timestamps: true}
)

userSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", userSchema)