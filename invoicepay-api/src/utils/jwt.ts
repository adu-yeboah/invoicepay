import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

//Password Hashing 
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(12)
    return bcrypt.hash(password, salt)
}


export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}


//JWT token generation 
const JWT_SECRET = process.env.JWT_SECRET || '30m'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'


export interface TokenPayload {
    userId: string;
    email: string;
}


export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}


export const generateRefreshToken = (payload: TokenPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
    })
}

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
}


export const validateToken = (authHeader: string | undefined): string | null => {
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return null
    }
    return authHeader.substring(7)
}