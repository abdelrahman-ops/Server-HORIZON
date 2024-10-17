import mongoose from "mongoose";

const {Schema} = mongoose;


// title , date , priority , stage (progress) , activities , subtasks , assets , team , isTrashed
const taskSchema = new Schema({
    
    title: {type : String , required: true },
    date: {type: Date, default: new Date() },
    priority: {
        type: String,
        default: "normal",
        enum: ["high" , "medium" , "normal" , "low"]
    },
    stage: {
        type: String,
        default: "todo",
        enum: ["todo","inprogress","completed"]
    },
    activities: [{
        type: {
            type: String,
            default: "assigned",
            enum: [
                "assigned",
                "started",
                "inprogress",
                "bug",
                "completed",
                "commented"
            ],
        },
        activity: String,
        date: {
            type: Date,
            default : new Date()
        },
        by: {type: Schema.Types.ObjectId , ref: "User"},
    },
    ],
    
    subTasks: [{
        title: String,
        date: Date,
        tag: String,
    },
    ],
    
    assets: [String],
    
    team: [{
        name: String,
        title: String,
        email: String,
    }],
    // team: [{type: Schema.Types.ObjectId , ref: "User"}],

    isTrashed: {type: Boolean , default: false},

},
    { collection: 'tasks'},
    {timestamps : true}
);

const Task = mongoose.model("Task", taskSchema);
console.log('Using model:', Task.collection.collectionName);
export default Task;