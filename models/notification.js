import mongoose, {Schema} from "mongoose";

const noticeSchema = new Schema({
    team: [{type: Schema.Types.ObjectId , ref: "User"}],
    text: {type: String},
    task: {type: Schema.Types.ObjectId, ref: "Task"},
    notiType: {type: String, default: "alert", enum: ["alert" , "message"]},
    isRead: [{type: Schema.Types.ObjectId, ref: "User"}],
},
    { collection: 'notification' },
    {timestamps: true}
);

const Notice = mongoose.model("Notice" , noticeSchema);
console.log('Using model:', Notice.collection.collectionName);
export default Notice;