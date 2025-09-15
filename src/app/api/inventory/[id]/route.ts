import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

// GET specific inventory item
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

    // Get inventory item
    const itemDoc = await db.collection("inventory").doc(params.id).get();
    
    if (!itemDoc.exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const itemData = itemDoc.data();
    
    // Check if user has access to this item
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    const hasAccess = userData?.role === "admin" || itemData?.ownerId === uid;
    
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const item = {
      id: itemDoc.id,
      ...itemData,
      lastUpdated: itemData?.lastUpdated?.toDate?.()?.toISOString(),
      createdAt: itemData?.createdAt?.toDate?.()?.toISOString(),
    };

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error getting inventory item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update inventory item
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

    // Check if item exists and user has access
    const itemDoc = await db.collection("inventory").doc(params.id).get();
    
    if (!itemDoc.exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const itemData = itemDoc.data();
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    if (!userData?.permissions?.canManageInventory && userData?.role !== 'admin') {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const hasAccess = userData?.role === "admin" || itemData?.ownerId === uid;
    
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Determine status based on quantity if quantity is being updated
    let status = updates.status;
    if (updates.quantity !== undefined) {
      const minQuantity = updates.minQuantity !== undefined ? updates.minQuantity : itemData?.minQuantity || 0;
      if (updates.quantity === 0) {
        status = 'out_of_stock';
      } else if (updates.quantity <= minQuantity) {
        status = 'low_stock';
      } else {
        status = 'in_stock';
      }
    }

    // Update inventory item
    const updateData = {
      ...updates,
      status,
      updatedBy: uid,
      lastUpdated: admin.FieldValue.serverTimestamp(),
    };

    await db.collection("inventory").doc(params.id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE inventory item
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

    // Check if item exists and user has access
    const itemDoc = await db.collection("inventory").doc(params.id).get();
    
    if (!itemDoc.exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const itemData = itemDoc.data();
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    if (!userData?.permissions?.canManageInventory && userData?.role !== 'admin') {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const hasAccess = userData?.role === "admin" || itemData?.ownerId === uid;
    
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete inventory item
    await db.collection("inventory").doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}