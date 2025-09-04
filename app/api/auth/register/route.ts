import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Safe user type excluding password
type SafeUser = Omit<User, 'password'>;

export async function POST(request: NextRequest) {
  try {
    const { name, email, password: rawPassword } = await request.json();

    // Validate input
    if (!name || !email || !rawPassword) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (rawPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        isOnline: true,
        lastSeen: new Date(),
      },
    });

    // Find or create global conversation
    let globalConversation = await prisma.conversation.findFirst({
      where: { isGlobal: true },
    });

    if (!globalConversation) {
      globalConversation = await prisma.conversation.create({
        data: {
          isGlobal: true,
          name: 'Global Chat',
          type: 'GROUP',
        },
      });
    }

    // Safely add user to global conversation via Participant table
    await prisma.participant.create({
      data: {
        userId: user.id,
        conversationId: globalConversation.id,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Exclude password from response
    const { password: _, ...responseUser }: SafeUser & { password: string } = user;

    return NextResponse.json({
      token,
      user: responseUser,
      message: 'Registration successful!',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
