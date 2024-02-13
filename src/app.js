import  express  from "express";
import cookieParser from "cookie-parser";
const app = express();


app.use(express.json({limit : "1mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';


app.use("/api/v1/users", userRouter);

export default app;