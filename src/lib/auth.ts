import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
  AuthError
} from "firebase/auth";
import { getFirebaseClients } from "./firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getAuth() {
    const { auth } = getFirebaseClients();
    if (!auth) {
      throw new Error("Firebase Auth chưa được khởi tạo");
    }
    return auth;
  }

  // Đăng ký bằng email/password
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthUser> {
    try {
      const auth = this.getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Cập nhật tên hiển thị nếu có
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Đăng nhập bằng email/password
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const auth = this.getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Đăng nhập bằng Google
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      const auth = this.getAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Gửi email reset password
  async resetPassword(email: string): Promise<void> {
    try {
      const auth = this.getAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Đăng xuất
  async signOut(): Promise<void> {
    try {
      const auth = this.getAuth();
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Lấy user hiện tại
  getCurrentUser(): User | null {
    const auth = this.getAuth();
    return auth.currentUser;
  }

  // Map Firebase User sang AuthUser
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  }

  // Xử lý lỗi auth
  private handleAuthError(error: AuthError): Error {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Không tìm thấy tài khoản với email này',
      'auth/wrong-password': 'Mật khẩu không chính xác',
      'auth/email-already-in-use': 'Email này đã được sử dụng',
      'auth/weak-password': 'Mật khẩu quá yếu',
      'auth/invalid-email': 'Email không hợp lệ',
      'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
      'auth/too-many-requests': 'Quá nhiều yêu cầu, vui lòng thử lại sau',
      'auth/popup-closed-by-user': 'Cửa sổ đăng nhập đã bị đóng',
      'auth/cancelled-popup-request': 'Yêu cầu đăng nhập đã bị hủy'
    };

    const message = errorMessages[error.code] || error.message || 'Đã xảy ra lỗi không xác định';
    return new Error(message);
  }
}

export const authService = AuthService.getInstance();