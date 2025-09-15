import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

// GET specific warehouse
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auth } = getFirebaseAdmin();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();

    // Get warehouse
    const warehouseDoc = await db.collection("warehouses").doc(params.id).get();
    
    if (!warehouseDoc.exists) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    const warehouseData = warehouseDoc.data();
    
    // Check if user has access to this warehouse
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    const hasAccess = userData?.role === "admin" || warehouseData?.ownerId === uid;
    
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const warehouse = {
      id: warehouseDoc.id,
      ...warehouseData,
      createdAt: warehouseData?.createdAt?.toDate?.()?.toISOString(),
      updatedAt: warehouseData?.updatedAt?.toDate?.()?.toISOString(),
    };

    return NextResponse.json({ warehouse });
  } catch (error) {
    console.error("Error getting warehouse:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update warehouse
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();

    // Check if user has access to this warehouse
    const warehouseDoc = await db.collection("warehouses").doc(params.id).get();
    
    if (!warehouseDoc.exists) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    const warehouseData = warehouseDoc.data();
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    const hasAccess = userData?.role === "admin" || warehouseData?.ownerId === uid;
    
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update warehouse
    const updateData = {
      ...updates,
      updatedAt: admin.FieldValue.serverTimestamp(),
    };

    await db.collection("warehouses").doc(params.id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating warehouse:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE warehouse
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auth } = getFirebaseAdmin();
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const admin = await import("firebase-admin/firestore");
    const db = admin.getFirestore();

    // Check if user is admin
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Check if warehouse exists
    const warehouseDoc = await db.collection("warehouses").doc(params.id).get();
    
    if (!warehouseDoc.exists) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    // Check if warehouse has inventory items
    const inventorySnapshot = await db
      .collection("inventory")
      .where("warehouseId", "==", params.id)
      .limit(1)
      .get();

    if (!inventorySnapshot.empty) {
      return NextResponse.json({ 
        error: "Cannot delete warehouse with inventory items. Please remove all items first." 
      }, { status: 400 });
    }

    // Delete warehouse
    await db.collection("warehouses").doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}