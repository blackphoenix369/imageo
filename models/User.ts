import mongoose,{Schema, model, models} from "mongoose"
import bcrypt from "bcryptjs"



//treated as single entity
export interface IUser {
    _id?:mongoose.Types.ObjectId;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
};

const userSchema = new Schema<IUser>(
    {
        email:{type: String, required:true, unique:true},
        password:{type: String, required:true},
    },{
        timestamps:true
    }
);


//pre hook data-(pre)->database-(post)->
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  //next();
});

const User = models?.User || model<IUser>("User", userSchema); 

export default User;