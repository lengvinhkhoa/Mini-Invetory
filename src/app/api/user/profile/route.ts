import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auth } = getFirebaseAdmin();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    // Get user profile from Firestore using Admin SDK
    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();
    
    const userDoc = await db.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ profile: null });
    }

    const data = userDoc.data();
    const profile = {
      uid,
      ...data,
      lastLogin: data?.lastLogin?.toDate?.()?.toISOString(),
      createdAt: data?.createdAt?.toDate?.()?.toISOString(),
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create user profile
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auth } = getFirebaseAdmin();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const body = await request.json();
    const { profile } = body;

    // Create user profile using Admin SDK
    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();
    
    const userProfile = {
      ...profile,
      uid,
      createdAt: admin.FieldValue.serverTimestamp(),
      lastLogin: admin.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(uid).set(userProfile);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auth } = getFirebaseAdmin();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const body = await request.json();
    const { updates } = body;

    // Update user profile using Admin SDK
    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();
    
    const updateData = {
      ...updates,
      lastLogin: admin.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(uid).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}