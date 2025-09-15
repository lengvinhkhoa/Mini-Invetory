import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
    try {
        // Test Firebase Admin SDK connection
        const { auth } = getFirebaseAdmin();

        // Test Firestore connection
        const admin = await import("firebase-admin/firestore");
        const db = admin.getFirestore();

        // Try to write a test document
        const testDoc = {
            message: "Firebase Admin SDK is working!",
            timestamp: admin.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection("test").add(testDoc);

        // Try to read it back
        const doc = await docRef.get();
        const data = doc.data();

        // Clean up test document
        await docRef.delete();

        return NextResponse.json({
            success: true,
            message: "Firebase Admin SDK is working correctly!",
            testData: data,
        });
    } catch (error: any) {
        console.error("Firebase test error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                details: error.stack
            },
            { status: 500 }
        );
    }
}