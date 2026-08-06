import { prisma } from "#config/database.js";
import { getGoogleAuthUrl, getGoogleUserInfo } from "#config/passport.js";
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
import { OAuth2Client } from "google-auth-library";

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
        business_name: validateData.business_name!,
        phone: validateData.phone!,
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
        message: "Invalid Email or Password",
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
          business_name: user.business_name,
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
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user data",
    });
  }
};

//start Google OAuth
export const googleAuth = (req: Request, res: Response) => {
  const authUrl = getGoogleAuthUrl();
  res.json({ success: true, authUrl });
};

//Google OAuth Callback
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(401).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    const userInfo = await getGoogleUserInfo(code);

    let user = await prisma.user.findUnique({
      where: { email: userInfo.email! },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userInfo.email!,
          name: userInfo.name!,
          password_hash: "OAUTH_USER",
          business_name: userInfo.name!,
        },
      });
    }

    const payloadToken = {
      userId: user.id,
      email: user.email,
    };
    const accessToken = generateAccessToken(payloadToken);
    const refreshToken = generateRefreshToken(payloadToken);

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  } catch (error) {
    console.error("Google OAuth error;", error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

//verify Google Token
export const verifyGoogleToken = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({
        status: false,
        message: "Google ID token is required",
      });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google Token",
      });
    }

    // Find or create user (same as above...)
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email!,
          name: payload.name!,
          password_hash: "OAUTH_USER",
          business_name: payload.name!,
        },
      });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Google token",
    });
  }
};
