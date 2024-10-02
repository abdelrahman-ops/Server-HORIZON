const routeNotFound = (req, res , next) => {
    const error = new Error (`Route not found : ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err , req , res , next) =>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let messsage = err.messsage;

    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 400;
        messsage = "Resource not found";
    }

    req.status(statusCode).json({
        messsage: messsage,
        stack: process.env.NODE_ENV !== "production" ? null : err.stack,
    })
}

export {routeNotFound , errorHandler}