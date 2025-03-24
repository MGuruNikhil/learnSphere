import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received Webhook:", body);

        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { type, data } = body;

        if (type === "user.created") {
            try {
                const user = await prisma.user.create({
                    data: {
                        clerkId: data.id,
                        email: data.email_addresses?.[0]?.email_address || "unknown",
                    },
                });
                console.log("User stored:", user);
                return NextResponse.json({ message: "User created successfully" }, { status: 200 });
            } catch (error) {
                console.error("Database Error:", error);
                return NextResponse.json({ error: "Database error" }, { status: 500 });
            }
        }
        return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    } catch (error) {
        console.error("Request Handling Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
