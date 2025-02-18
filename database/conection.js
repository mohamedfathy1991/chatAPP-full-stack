import 'dotenv/config';

import mongoose,{connections} from 'mongoose';
//Set up default mongoose connection
 

mongoose.connect(process.env.MONGODB) .then(()=>{
    console.log("conected to db");
    
}).catch(()=>{
    console.log("error connecting to db");
})

 