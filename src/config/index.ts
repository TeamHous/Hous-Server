import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT as string, 10) as number,

    /**
     * MongoDB URI
     */
    mongoURI: process.env.MONGODB_URI as string,

    /**
     * jwt Secret
     */
    jwtSecret: process.env.JWT_SECRET as string,

    /**
     * jwt Algorithm
     */
    jwtAlgo: process.env.JWT_ALGO as string,
};
