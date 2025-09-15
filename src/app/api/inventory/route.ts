import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

// GET all inventory or warehouse inventory
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

        const { searchParams } = new URL(request.url);
        const warehouseId = searchParams.get('warehouseId');

        const admin = await import("firebase-admin/firestore");
        const db = admin.getFirestore();

        // Get user profile to check permissions
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();

        if (!userData?.permissions?.canManageInventory && userData?.role !== 'admin') {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        let inventoryQuery: any = db.collection("inventory");

        // Admin can see all inventory, others only their own
        if (userData?.role !== 'admin') {
            inventoryQuery = inventoryQuery.where("ownerId", "==", uid);
        }

        // Filter by warehouse if specified
        if (warehouseId) {
            inventoryQuery = inventoryQuery.where("warehouseId", "==", warehouseId);
        }

        const inventorySnapshot = await inventoryQuery.get();

        const items = inventorySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            lastUpdated: doc.data().lastUpdated?.toDate?.()?.toISOString(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        }));

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Error getting inventory:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST create inventory item
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
        const { item } = body;

        const admin = await import("firebase-admin/firestore");
        const db = admin.getFirestore();

        // Check permissions
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();

        if (!userData?.permissions?.canManageInventory && userData?.role !== 'admin') {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        // Verify warehouse ownership for non-admin users
        if (userData?.role !== 'admin') {
            const warehouseDoc = await db.collection("warehouses").doc(item.warehouseId).get();
            const warehouseData = warehouseDoc.data();
            
            if (!warehouseDoc.exists || warehouseData?.ownerId !== uid) {
                return NextResponse.json({ error: "Access denied to warehouse" }, { status: 403 });
            }
        }

        // Determine status based on quantity
        let status = 'in_stock';
        if (item.quantity === 0) {
            status = 'out_of_stock';
        } else if (item.quantity <= item.minQuantity) {
            status = 'low_stock';
        }

        const itemData = {
            ...item,
            ownerId: uid, // Set owner to current user
            status,
            updatedBy: uid,
            createdAt: admin.FieldValue.serverTimestamp(),
            lastUpdated: admin.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection("inventory").add(itemData);

        return NextResponse.json({
            itemId: docRef.id,
            item: { id: docRef.id, ...itemData }
        });
    } catch (error) {
        console.error("Error creating inventory item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}