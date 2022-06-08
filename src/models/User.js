import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema(
    {
        email: {type:String, required:true},
        avatarUrl: {type: String},
        isO_Auth:{type:Boolean, default: false},
        username : {type:String, required: true, unique: true},
        password:{type:String, required:false},
        name: {type:String, required:true},
        videos : [{type: mongoose.Schema.Types.ObjectId, ref:"Video"}],
        // videos : [{type: mongoose.Schema.Types.ObjectId, ref:"Video"}],
        // comments : [{type: mongoose.Schema.Types.ObjectId, ref:"Comment"}]
    }
)

userSchema.pre('save', async function (){
    if(this.isModified("password"))
        this.password = await bcrypt.hash(this.password,10);
})

const User = mongoose.model("User",userSchema);

export default User;