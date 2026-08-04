import { prisma } from "#config/database.js";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from "#utils/jwt.js";
import { generateSecureToken, storeToken } from "#utils/otp.js";
import {
  loginSchema,
  registerSchema,
  type RegisterInput,
} from "#utils/validation.schema.js";
import type { Request, Response } from "express";

// register
export const register = async (req: Request, res: Response) => {
  try {
    const validateData: RegisterInput = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validateData.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await hashPassword(validateData.password);
    const user = await prisma.user.create({
      data: {
        email: validateData.email,
        password_hash: hashedPassword,
        business_name: validateData.business_name,
        phone: validateData.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        business_name: true,
        created_at: true,
      },
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    if (error.name == "ZodError") {
      return res.status(400).json({
        success: false,
        message: "An error occurred during registration",
      });
    }
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const validateData = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: validateData.email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or Password",
      });
    }

    const isValidPassword = await comparePassword(
      validateData.password,
      user.password_hash,
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Inavlid Email or Password",
      });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          bussiness_name: user.business_name,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    if (error.name == "ZodError") {
      return res.status(400).json({
        success: false,
        message: "An error occurred during login",
      });
    }
  }
};

// get user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        business_name: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: true,
        data: { user },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user data",
    });
  }
};

