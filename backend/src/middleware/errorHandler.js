export const errorHandler = (err, req, res, next) => {

    // Prisma known request error
    if (err.code === "P2021") {
        return res.status(500).json({
            success: false,
            message: "Database table does not exist",
        });
    }

    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists",
        });
    }

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};