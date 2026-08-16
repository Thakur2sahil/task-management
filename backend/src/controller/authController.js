import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const register = async (req, res, next) => {
    try {
        const { user_name, email, password, confirmPassword } = req.body;

        if (!user_name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                user_name,
                email,
                password: passwordHash,
            },
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                email: user.email,
                user_name: user.user_name,
            },
        });
    } catch (error) {
        next(error);
    }

};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // Find user
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Check JWT secret
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in .env");
        }

        // Create JWT
        const jwtToken = jwt.sign(
            {
                user_id: existingUser.id,
                email: existingUser.email,
                user_name: existingUser.user_name,
                role: existingUser.role,
            },
            jwtSecret,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            message: "Login successful",
            data: {
                token: jwtToken,
                role: existingUser.role
            },
        });
    } catch (error) {
        next(error);
    }
};
