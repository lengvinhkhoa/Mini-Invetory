import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

// POST create warehouse
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
    const { warehouse } = body;

    // Create warehouse using Admin SDK
    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();
    
    const warehouseData = {
      ...warehouse,
      ownerId: uid, // Set owner to current user
      managers: warehouse.managers || [uid],
      currentStock: 0,
      totalItems: 0,
      status: "active",
      createdAt: admin.FieldValue.serverTimestamp(),
      updatedAt: admin.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("warehouses").add(warehouseData);

    return NextResponse.json({ 
      warehouseId: docRef.id,
      warehouse: { id: docRef.id, ...warehouseData }
    });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET user warehouses
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

    // Get user profile to check role
    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();
    
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    let warehousesSnapshot;
    
    // Admin can see all warehouses, others only their own
    if (userData?.role === "admin") {
      warehousesSnapshot = await db.collection("warehouses").get();
    } else {
      warehousesSnapshot = await db
        .collection("warehouses")
        .where("ownerId", "==", uid)
        .get();
    }

    const warehouses = warehousesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
    }));

    return NextResponse.json({ warehouses });
  } catch (error) {
    console.error("Error getting warehouses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}