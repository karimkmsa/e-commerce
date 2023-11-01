import mongoose from "mongoose";


const dbConnection = () => {
    mongoose
      .connect(process.env.DB_CONNECTION||'mongodb+srv://route40:test123@cluster0.cvvzj9s.mongodb.net/E-commerce')
      .then((conn) => console.log(`Database connected on ${process.env.DB_CONNECTION}`))
      .catch((err) => console.log(` Database Error ${err}`));
}


export default dbConnection