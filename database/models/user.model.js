import { model, Schema } from "mongoose"




const userschema= new  Schema({
    username: {
        type: String,
        unique: true, // يجعل اسم المستخدم فريدًا
        required: [true, 'Username is required'], // يضيف شرطًا بأن الحقل مطلوب
        trim: true, // يزيل المسافات الزائدة من البداية والنهاية
      },
     password:String

},{
    timestamps:true
})


export const UserModel=   model('User',userschema)