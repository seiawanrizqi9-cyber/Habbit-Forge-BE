import prisma from "../database";
import config from '../utils/env'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const register = async (data: {
    username: string;
    email: string;
    password: string;
}) => {
    // Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ 
        where: { email: data.email } 
    });
    
    if (existingUser) {
        throw new Error("Email sudah terdaftar");
    }

    // Cek username sudah terdaftar
    const existingUsername = await prisma.user.findUnique({
        where: { username: data.username }
    });
    
    if (existingUsername) {
        throw new Error("Username sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Buat user beserta profile
    const user = await prisma.user.create({
        data: {
            email: data.email,
            username: data.username,
            password: hashedPassword,
            profile: {
                create: {
                    fullName: data.username
                }
            }
        },
        include: {
            profile: true
        }
    });

    // Generate token setelah register
    const token = jwt.sign(
        { 
            id: user.id,
            email: user.email,
            username: user.username,
            role: 'user'
        },
        config.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            profile: user.profile
        },
        token
    };
};

export const login = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
        include: { profile: true }
    });
    
    if (!user) {
        throw new Error("Email atau password salah");
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
        throw new Error("Email atau password salah");
    }

    const token = jwt.sign(
        { 
            id: user.id,
            email: user.email,
            username: user.username,
            role: 'user'
        },
        config.JWT_SECRET,
        { expiresIn: '7d' }
    );

    const userReturn = {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        createdAt: user.createdAt
    };

    return { user: userReturn, token };
};

export const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            updatedAt: true,
            profile: true
        }
    });
    
    if (!user) {
        throw new Error("User tidak ditemukan");
    }
    
    return user;
};