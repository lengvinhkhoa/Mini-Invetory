(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const Toaster = (param)=>{
    let { ...props } = param;
    _s();
    const { theme = "system" } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        theme: theme,
        className: "toaster group",
        style: {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)"
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sonner.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Toaster, "EriOrahfenYKDCErPq+L6926Dw4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Toaster;
;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFirebaseClients",
    ()=>getFirebaseClients
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
function readConfig() {
    return {
        apiKey: ("TURBOPACK compile-time value", "AIzaSyCo92GuVQyYX3KJIvSIQ-8jGqOOXJh-kE"),
        authDomain: ("TURBOPACK compile-time value", "inventory-mini-by-aurora-cap.firebaseapp.com"),
        projectId: ("TURBOPACK compile-time value", "inventory-mini-by-aurora-cap"),
        storageBucket: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: ("TURBOPACK compile-time value", "299099907994"),
        appId: ("TURBOPACK compile-time value", "1:299099907994:web:6f9eb75577f5cbd125bc23")
    };
}
function getFirebaseClients() {
    const cfg = readConfig();
    if (!cfg.apiKey || !cfg.authDomain || !cfg.projectId || !cfg.appId) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn("Firebase client config missing. Set NEXT_PUBLIC_FIREBASE_* envs.");
        }
        return {
            app: null,
            auth: null,
            firestore: null
        };
    }
    const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])()[0] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(cfg);
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
    const firestore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
    return {
        app,
        auth,
        firestore
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthService",
    ()=>AuthService,
    "authService",
    ()=>authService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
;
;
;
class AuthService {
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    getAuth() {
        const { auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseClients"])();
        if (!auth) {
            throw new Error("Firebase Auth chưa được khởi tạo");
        }
        return auth;
    }
    // Đăng ký bằng email/password
    async signUpWithEmail(email, password, displayName) {
        try {
            const auth = this.getAuth();
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(auth, email, password);
            // Cập nhật tên hiển thị nếu có
            if (displayName && userCredential.user) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(userCredential.user, {
                    displayName
                });
            }
            return this.mapFirebaseUser(userCredential.user);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }
    // Đăng nhập bằng email/password
    async signInWithEmail(email, password) {
        try {
            const auth = this.getAuth();
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, email, password);
            return this.mapFirebaseUser(userCredential.user);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }
    // Đăng nhập bằng Google
    async signInWithGoogle() {
        try {
            const auth = this.getAuth();
            const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
            provider.addScope('email');
            provider.addScope('profile');
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithPopup"])(auth, provider);
            return this.mapFirebaseUser(userCredential.user);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }
    // Gửi email reset password
    async resetPassword(email) {
        try {
            const auth = this.getAuth();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendPasswordResetEmail"])(auth, email);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }
    // Đăng xuất
    async signOut() {
        try {
            const auth = this.getAuth();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }
    // Lấy user hiện tại
    getCurrentUser() {
        const auth = this.getAuth();
        return auth.currentUser;
    }
    // Map Firebase User sang AuthUser
    mapFirebaseUser(user) {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
    }
    // Xử lý lỗi auth
    handleAuthError(error) {
        const errorMessages = {
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(AuthService, "instance", void 0);
const authService = AuthService.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useAuth() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function AuthProvider(param) {
    let { children } = param;
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const { auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseClients"])();
            if (!auth) {
                setLoading(false);
                return;
            }
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(auth, {
                "AuthProvider.useEffect.unsubscribe": async (firebaseUser)=>{
                    if (firebaseUser) {
                        const authUser = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL
                        };
                        setUser(authUser);
                        // Tạo session token
                        try {
                            const idToken = await firebaseUser.getIdToken();
                            await fetch('/api/auth/verify', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    idToken
                                })
                            });
                        } catch (error) {
                            console.error('Error creating session:', error);
                        }
                    } else {
                        setUser(null);
                        // Xóa session khi logout
                        fetch('/api/auth/logout', {
                            method: 'POST'
                        });
                    }
                    setLoading(false);
                }
            }["AuthProvider.useEffect.unsubscribe"]);
            return ({
                "AuthProvider.useEffect": ()=>unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
    const signIn = async (email, password)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].signInWithEmail(email, password);
    };
    const signUp = async (email, password, displayName)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].signUpWithEmail(email, password, displayName);
    };
    const signInWithGoogle = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].signInWithGoogle();
    };
    const resetPassword = async (email)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].resetPassword(email);
    };
    const signOut = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].signOut();
    };
    const value = {
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOut
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
_s1(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firestore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API-based Firestore service (using server-side routes)
__turbopack_context__.s([
    "firestoreService",
    ()=>firestoreService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class FirestoreService {
    static getInstance() {
        if (!FirestoreService.instance) {
            FirestoreService.instance = new FirestoreService();
        }
        return FirestoreService.instance;
    }
    // User Profile Methods
    async getUserProfile(uid) {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                credentials: 'include'
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
                createdAt: data.profile.createdAt ? new Date(data.profile.createdAt) : new Date()
            };
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }
    async createUserProfile(profile) {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    profile
                })
            });
            if (!response.ok) {
                throw new Error('Failed to create user profile');
            }
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }
    async updateUserProfile(uid, updates) {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    updates
                })
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
    async createWarehouse(warehouse) {
        try {
            const response = await fetch('/api/warehouses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    warehouse
                })
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
    async getUserWarehouses() {
        try {
            const response = await fetch('/api/warehouses', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to get warehouses');
            }
            const data = await response.json();
            return data.warehouses.map((warehouse)=>({
                    ...warehouse,
                    createdAt: warehouse.createdAt ? new Date(warehouse.createdAt) : new Date(),
                    updatedAt: warehouse.updatedAt ? new Date(warehouse.updatedAt) : new Date()
                }));
        } catch (error) {
            console.error('Error getting user warehouses:', error);
            throw error;
        }
    }
    async getWarehouse(id) {
        try {
            const response = await fetch("/api/warehouses/".concat(id), {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error('Failed to get warehouse');
            }
            const data = await response.json();
            return {
                ...data.warehouse,
                createdAt: data.warehouse.createdAt ? new Date(data.warehouse.createdAt) : new Date(),
                updatedAt: data.warehouse.updatedAt ? new Date(data.warehouse.updatedAt) : new Date()
            };
        } catch (error) {
            console.error('Error getting warehouse:', error);
            throw error;
        }
    }
    async updateWarehouse(id, updates) {
        try {
            const response = await fetch("/api/warehouses/".concat(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    updates
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update warehouse');
            }
        } catch (error) {
            console.error('Error updating warehouse:', error);
            throw error;
        }
    }
    async deleteWarehouse(id) {
        try {
            const response = await fetch("/api/warehouses/".concat(id), {
                method: 'DELETE',
                credentials: 'include'
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
    async getAllInventory() {
        try {
            const response = await fetch('/api/inventory', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to get inventory');
            }
            const data = await response.json();
            return data.items.map((item)=>({
                    ...item,
                    lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : new Date(),
                    createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
                }));
        } catch (error) {
            console.error('Error getting inventory:', error);
            throw error;
        }
    }
    async getWarehouseInventory(warehouseId) {
        try {
            const response = await fetch("/api/inventory?warehouseId=".concat(warehouseId), {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to get warehouse inventory');
            }
            const data = await response.json();
            return data.items.map((item)=>({
                    ...item,
                    lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : new Date(),
                    createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
                }));
        } catch (error) {
            console.error('Error getting warehouse inventory:', error);
            throw error;
        }
    }
    async getInventoryItem(id) {
        try {
            const response = await fetch("/api/inventory/".concat(id), {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error('Failed to get inventory item');
            }
            const data = await response.json();
            return {
                ...data.item,
                lastUpdated: data.item.lastUpdated ? new Date(data.item.lastUpdated) : new Date(),
                createdAt: data.item.createdAt ? new Date(data.item.createdAt) : new Date()
            };
        } catch (error) {
            console.error('Error getting inventory item:', error);
            throw error;
        }
    }
    async addInventoryItem(item) {
        try {
            const response = await fetch('/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    item
                })
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
    async updateInventoryItem(id, updates) {
        try {
            const response = await fetch("/api/inventory/".concat(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    updates
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update inventory item');
            }
        } catch (error) {
            console.error('Error updating inventory item:', error);
            throw error;
        }
    }
    async deleteInventoryItem(id) {
        try {
            const response = await fetch("/api/inventory/".concat(id), {
                method: 'DELETE',
                credentials: 'include'
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
    async addTransaction(transaction) {
        // TODO: Implement API route for transactions
        return '';
    }
    async getWarehouseTransactions(warehouseId) {
        let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 50;
        // TODO: Implement API route for transactions
        return [];
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(FirestoreService, "instance", void 0);
const firestoreService = FirestoreService.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/UserContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserProvider",
    ()=>UserProvider,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firestore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const UserContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useUser() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
_s(useUser, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function UserProvider(param) {
    let { children } = param;
    _s1();
    const [userProfile, setUserProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const refreshProfile = async ()=>{
        if (!user) {
            setUserProfile(null);
            setLoading(false);
            return;
        }
        try {
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreService"].getUserProfile(user.uid);
            setUserProfile(profile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUserProfile(null);
        } finally{
            setLoading(false);
        }
    };
    const updateProfile = async (updates)=>{
        if (!user || !userProfile) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreService"].updateUserProfile(user.uid, updates);
            setUserProfile({
                ...userProfile,
                ...updates
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserProvider.useEffect": ()=>{
            refreshProfile();
        }
    }["UserProvider.useEffect"], [
        user
    ]);
    const value = {
        userProfile,
        loading,
        refreshProfile,
        updateProfile
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/UserContext.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s1(UserProvider, "7c5Br6/VV8Jw8BU4EJjYKP9aQSE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = UserProvider;
var _c;
__turbopack_context__.k.register(_c, "UserProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_cebb007e._.js.map