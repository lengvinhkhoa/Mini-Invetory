// API-based Firestore service (using server-side routes)

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'staff';
  warehouses: string[];
  permissions: {
    canManageInventory: boolean;
    canProcessOrders: boolean;
    canViewReports: boolean;
  };
  isSetupComplete: boolean;
  lastLogin: Date;
  createdAt: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentStock: number;
  totalItems: number;
  managers: string[];
  ownerId: string; // User who created this warehouse
  status: 'active' | 'inactive' | 'maintenance';
  description?: string;
  phone?: string;
  email?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  warehouseId: string;
  ownerId: string; // User who owns this item
  category: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  supplier?: string;
  location?: string;
  lastUpdated: Date;
  updatedBy: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: 'IN' | 'OUT';
  itemId: string;
  quantity: number;
  timestamp: Date;
  processedBy: string;
  warehouseId: string;
  reason: string;
}

class FirestoreService {
  private static instance: FirestoreService;

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  // User Profile Methods
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to get user profile');
      }

      const data = await response.json();
      if (!data.profile) return null;

      return {
        ...data.profile,
        lastLogin: data.profile.lastLogin ? new Date(data.profile.lastLogin) : new Date(),
        createdAt: data.profile.createdAt ? new Date(data.profile.createdAt) : new Date(),
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'lastLogin'>): Promise<void> {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Warehouse Methods
  async createWarehouse(warehouse: Omit<Warehouse, 'id' | 'createdAt'>): Promise<string> {
    try {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ warehouse }),
      });

      if (!response.ok) {
        throw new Error('Failed to create warehouse');
      }

      const data = await response.json();
      return data.warehouseId;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }

  async getUserWarehouses(): Promise<Warehouse[]> {
    try {
      const response = await fetch('/api/warehouses', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to get warehouses');
      }

      const data = await response.json();
      return data.warehouses.map((warehouse: any) => ({
        ...warehouse,
        createdAt: warehouse.createdAt ? new Date(warehouse.createdAt) : new Date(),
        updatedAt: warehouse.updatedAt ? new Date(warehouse.updatedAt) : new Date(),
      }));
    } catch (error) {
      console.error('Error getting user warehouses:', error);
      throw error;
    }
  }

  async getWarehouse(id: string): Promise<Warehouse | null> {
    try {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get warehouse');
      }

      const data = await response.json();
      return {
        ...data.warehouse,
        createdAt: data.warehouse.createdAt ? new Date(data.warehouse.createdAt) : new Date(),
        updatedAt: data.warehouse.updatedAt ? new Date(data.warehouse.updatedAt) : new Date(),
      };
    } catch (error) {
      console.error('Error getting warehouse:', error);
      throw error;
    }
  }

  async updateWarehouse(id: string, updates: Partial<Warehouse>): Promise<void> {
    try {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update warehouse');
      }
    } catch (error) {
      console.error('Error updating warehouse:', error);
      throw error;
    }
  }

  async deleteWarehouse(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete warehouse');
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      throw error;
    }
  }

  // Inventory Methods
  async getAllInventory(): Promise<InventoryItem[]> {
    try {
      const response = await fetch('/api/inventory', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to get inventory');
      }

      const data = await response.json();
      return data.items.map((item: any) => ({
        ...item,
        lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : new Date(),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      }));
    } catch (error) {
      console.error('Error getting inventory:', error);
      throw error;
    }
  }

  async getWarehouseInventory(warehouseId: string): Promise<InventoryItem[]> {
    try {
      const response = await fetch(`/api/inventory?warehouseId=${warehouseId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to get warehouse inventory');
      }

      const data = await response.json();
      return data.items.map((item: any) => ({
        ...item,
        lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : new Date(),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      }));
    } catch (error) {
      console.error('Error getting warehouse inventory:', error);
      throw error;
    }
  }

  async getInventoryItem(id: string): Promise<InventoryItem | null> {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get inventory item');
      }

      const data = await response.json();
      return {
        ...data.item,
        lastUpdated: data.item.lastUpdated ? new Date(data.item.lastUpdated) : new Date(),
        createdAt: data.item.createdAt ? new Date(data.item.createdAt) : new Date(),
      };
    } catch (error) {
      console.error('Error getting inventory item:', error);
      throw error;
    }
  }

  async addInventoryItem(item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt'>): Promise<string> {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ item }),
      });

      if (!response.ok) {
        throw new Error('Failed to add inventory item');
      }

      const data = await response.json();
      return data.itemId;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<void> {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory item');
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  async deleteInventoryItem(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete inventory item');
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  // Transaction Methods (placeholder - implement later)
  async addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<string> {
    // TODO: Implement API route for transactions
    return '';
  }

  async getWarehouseTransactions(warehouseId: string, limit = 50): Promise<Transaction[]> {
    // TODO: Implement API route for transactions
    return [];
  }
}

export const firestoreService = FirestoreService.getInstance();