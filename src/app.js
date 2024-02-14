import  express  from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
const app = express();


app.use(express.json({limit : "1mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';

app.get("/", (req,res) => {
    res.send("<h1>Welcome to the TaskSecure</h1>");
})
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks",taskRouter)

export default app;