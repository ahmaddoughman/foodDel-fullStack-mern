import mongoose from "mongoose";

export const connectDb = async () =>{
    await mongoose.connect('mongodb+srv://ahmaddoughman1234:Sl0olvpT89mdmoZl@cluster0.lak0esa.mongodb.net/food-del')
    .then(() => console.log('MongoDB Connected'))

}
