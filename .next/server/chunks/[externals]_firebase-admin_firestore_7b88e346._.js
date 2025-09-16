module.exports = [
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_firebase-admin_firestore_cc86207c._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
    });
});
}),
];