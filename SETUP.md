# Hướng dẫn thiết lập Firebase Auth + Firestore

## 1. Cấu hình Firebase Console

### Bước 1: Tạo project Firebase
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc sử dụng project hiện có
3. Bật Firestore Database và Authentication

### Bước 2: Cấu hình Authentication
1. Vào **Authentication** > **Sign-in method**
2. Bật **Email/Password** provider
3. Bật **Google** provider:
   - Thêm OAuth client ID và secret
   - Thêm authorized domains (localhost:3000 cho development)

### Bước 3: Cấu hình Firestore
1. Vào **Firestore Database** > **Rules**
2. Copy nội dung từ file `firestore.rules` và paste vào
3. Publish rules

### Bước 4: Lấy Firebase config
1. Vào **Project Settings** > **General**
2. Scroll xuống **Your apps** > **Web app**
3. Copy config object

## 2. Cấu hình Environment Variables

File `.env.local` đã được tạo với config của bạn. Nếu cần thay đổi:

```env
# Firebase Client Configuration (đã có)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCo92GuVQyYX3KJlvSlQ-8jGqOOXJh--kE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=inventory-mini-by-aurora-cap.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=inventory-mini-by-aurora-cap
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=inventory-mini-by-aurora-cap.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=299099907994
NEXT_PUBLIC_FIREBASE_APP_ID=1:299099907994:web:6f9eb75577f5cbd125bc23

# Firebase Admin SDK (đã có)
FIREBASE_PROJECT_ID=inventory-mini-by-aurora-cap
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@inventory-mini-by-aurora-cap.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[Your private key]\n-----END PRIVATE KEY-----\n"
```

### Nếu cần tạo Service Account mới:
1. Vào [Firebase Console](https://console.firebase.google.com/project/inventory-mini-by-aurora-cap/settings/serviceaccounts/adminsdk)
2. Click **Generate new private key**
3. Download JSON file
4. Copy `project_id`, `client_email`, và `private_key` vào `.env.local`

## 3. Cấu trúc Database

### Collections:

#### `users`
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  role: 'admin' | 'manager' | 'staff',
  warehouses: string[],
  permissions: {
    canManageInventory: boolean,
    canProcessOrders: boolean,
    canViewReports: boolean
  },
  isSetupComplete: boolean,
  lastLogin: timestamp,
  createdAt: timestamp
}
```

#### `warehouses`
```javascript
{
  name: string,
  address: string,
  capacity: number,
  currentStock: number,
  totalItems: number,
  ownerId: string, // User who owns this warehouse
  managers: string[],
  status: 'active' | 'inactive' | 'maintenance',
  description?: string,
  phone?: string,
  email?: string,
  location?: {
    lat: number,
    lng: number
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `inventory`
```javascript
{
  name: string,
  description: string,
  sku: string,
  quantity: number,
  minQuantity: number,
  unitPrice: number,
  warehouseId: string,
  ownerId: string, // User who owns this item
  category: string,
  status: 'in_stock' | 'low_stock' | 'out_of_stock',
  supplier?: string,
  location?: string,
  lastUpdated: timestamp,
  updatedBy: string,
  createdAt: timestamp
}
```

#### `transactions`
```javascript
{
  type: 'IN' | 'OUT',
  itemId: string,
  quantity: number,
  timestamp: timestamp,
  processedBy: string,
  warehouseId: string,
  reason: string
}
```

## 4. Chạy ứng dụng

```bash
npm run dev
```

## 5. Test chức năng

### Bước 1: Test Firebase connection
```bash
npm run dev
```
Truy cập: `http://localhost:3000/api/test-firebase`
Nếu thấy `"success": true` thì Firebase Admin SDK đã hoạt động.

### Bước 2: Test Authentication
1. Truy cập `http://localhost:3000/auth`
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Sau khi đăng nhập lần đầu, sẽ hiện dialog setup
4. Điền thông tin và tạo kho hàng đầu tiên
5. Được redirect về dashboard với thông tin đầy đủ

### Bước 3: Kiểm tra Firestore
Vào Firebase Console > Firestore Database, sẽ thấy:
- Collection `users` với user profile
- Collection `warehouses` với warehouse đã tạo
- Collection `test` (có thể có từ test API)

## 6. Troubleshooting

### Lỗi Firebase config
- Kiểm tra tất cả environment variables đã được set đúng
- Đảm bảo domain được thêm vào authorized domains

### Lỗi Firestore permissions
- Kiểm tra Security Rules đã được deploy
- Đảm bảo user đã được tạo trong collection `users`

### Lỗi Google Sign-in
- Kiểm tra OAuth client ID và secret
- Đảm bảo authorized domains bao gồm localhost:3000