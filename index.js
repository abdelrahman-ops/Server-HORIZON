import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middleware/errorMiddlewares.js";

// import routes from "./routes/index.js";
// import { dbConnection } from "./utils/index.js";

// dbConnection();

const app = express();

// middlewares
app.use(
    cors({
        origin : ["http://localgost:3000" , "http://localgost:3001"],
        methods : ["GET", "POST", "PUT", "DELETE"],
        credentials : true,
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(cookieParser());

app.use(morgan("dev"));
// app.use("/api" , routes);

app.use(routeNotFound);
app.use(errorHandler);


// Basic route to check server setup
app.get('/', (req, res) => {
    res.send('Server is up and running');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


