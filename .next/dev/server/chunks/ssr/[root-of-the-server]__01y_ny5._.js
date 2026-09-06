module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/src/lib/AuthBootstrap.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthBootstrap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$productsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/productsApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features/authSlice.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function AuthBootstrap({ children }) {
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDispatch"])();
    const [refresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$productsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRefreshMutation"])();
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        const unblock = ()=>{
            if (!cancelled) setReady(true);
        };
        // Hard ceiling: no single network call — a cold Vercel function, a
        // slow database wake-up, a flaky edge hop — is allowed to freeze the
        // entire site on this screen forever. Worst case, a slow/failed
        // refresh just means the visitor loads as a public (logged-out) user
        // instead of staying silently stuck.
        const timeout = setTimeout(unblock, 4000);
        refresh().unwrap().then((data)=>{
            if (cancelled) return;
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCredentials"])({
                accessToken: data.accessToken
            }));
            // If the 4s ceiling already fired and rendered the public view,
            // this refetches with the now-valid token instead of leaving the
            // owner stuck looking logged-out until they manually reload —
            // the exact "sometimes shows me as logged out" symptom this fixes.
            dispatch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$productsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productsApi"].util.invalidateTags([
                'Product',
                'Analytics'
            ]));
        }).catch(()=>{}).finally(()=>{
            clearTimeout(timeout);
            unblock();
        });
        return ()=>{
            cancelled = true;
            clearTimeout(timeout);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!ready) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                background: 'var(--color-bg)',
                color: 'var(--color-text)'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-center p-12 gap-5 opacity-80 min-h-[200px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-10 h-10 border-4 border-t-[var(--color-accent)] border-[var(--color-text)] animate-spin shadow-[4px_4px_0_0_var(--color-text)]"
                    }, void 0, false, {
                        fileName: "[project]/src/lib/AuthBootstrap.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-mono text-[11px] tracking-widest uppercase font-bold animate-pulse",
                        children: "Loading app..."
                    }, void 0, false, {
                        fileName: "[project]/src/lib/AuthBootstrap.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/lib/AuthBootstrap.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/lib/AuthBootstrap.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/AuthBootstrap.tsx",
        lineNumber: 58,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/lib/StoreProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function StoreProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["store"],
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/StoreProvider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/lib/api/productsApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "API_ORIGIN",
    ()=>API_ORIGIN,
    "downloadProductsCsv",
    ()=>downloadProductsCsv,
    "productsApi",
    ()=>productsApi,
    "resolveImageUrl",
    ()=>resolveImageUrl,
    "useCreateProductMutation",
    ()=>useCreateProductMutation,
    "useDeleteProductMutation",
    ()=>useDeleteProductMutation,
    "useGetAnalyticsByCategoryQuery",
    ()=>useGetAnalyticsByCategoryQuery,
    "useGetAnalyticsByMonthQuery",
    ()=>useGetAnalyticsByMonthQuery,
    "useGetAnalyticsSummaryQuery",
    ()=>useGetAnalyticsSummaryQuery,
    "useGetProductQuery",
    ()=>useGetProductQuery,
    "useGetProductsQuery",
    ()=>useGetProductsQuery,
    "useGetUpcomingWarrantyQuery",
    ()=>useGetUpcomingWarrantyQuery,
    "useLoginMutation",
    ()=>useLoginMutation,
    "useLogoutMutation",
    ()=>useLogoutMutation,
    "useRefreshMutation",
    ()=>useRefreshMutation,
    "useUpdateProductMutation",
    ()=>useUpdateProductMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features/authSlice.ts [app-ssr] (ecmascript)");
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://tracker-api.rifatsarker.com/api/v1") || 'http://localhost:4000/api/v1';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
function resolveImageUrl(url) {
    if (!url) return undefined;
    return url.startsWith('/') ? `${API_ORIGIN}${url}` : url;
}
const rawBaseQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
    baseUrl: API_BASE_URL,
    // Needed so the httpOnly refresh-token cookie set by /auth/login travels
    // with /auth/refresh and /auth/logout requests.
    credentials: 'include',
    // Hard ceiling on every request — a hung connection (cold serverless
    // function, flaky network hop) aborts and surfaces as a normal RTK
    // Query error instead of leaving a screen stuck in "Loading…" forever.
    timeout: 15000,
    prepareHeaders: (headers, { getState })=>{
        const token = getState().auth.accessToken;
        if (token) headers.set('authorization', `Bearer ${token}`);
        return headers;
    }
});
// Access tokens are short-lived (15m). Without this, an owner mid-session
// would silently start getting 401s / public-shaped data the moment the
// token expired — looking exactly like an unexplained random logout, with
// no error shown. This retries once through /auth/refresh (de-duplicated
// so N simultaneous 401s only trigger one refresh call) before giving up;
// only then does it actually clear the session, with a visible reason.
let refreshPromise = null;
const baseQueryWithReauth = async (args, api, extraOptions)=>{
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status !== 401) return result;
    const url = typeof args === 'string' ? args : args.url;
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) return result;
    const wasAuthenticated = api.getState().auth.isAuthenticated;
    if (!wasAuthenticated) return result;
    if (!refreshPromise) {
        refreshPromise = (async ()=>{
            const refreshResult = await rawBaseQuery({
                url: '/auth/refresh',
                method: 'POST'
            }, api, extraOptions);
            const token = refreshResult.data?.data?.accessToken;
            if (token) {
                api.dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCredentials"])({
                    accessToken: token
                }));
                return token;
            }
            return null;
        })().finally(()=>{
            refreshPromise = null;
        });
    }
    const newToken = await refreshPromise;
    if (newToken) return rawBaseQuery(args, api, extraOptions);
    api.dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sessionExpired"])('Your session has expired. Please sign in again.'));
    // Drop any owner-shaped cached responses fetched before the session died —
    // otherwise a stale cache entry could still render sensitive fields after
    // the user has effectively been logged out.
    api.dispatch(productsApi.util.invalidateTags([
        'Product',
        'Analytics'
    ]));
    return result;
};
const productsApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'Product',
        'Analytics'
    ],
    // Auto-refetch active queries when the tab regains focus or the network
    // comes back — paired with setupListeners(store.dispatch) in store.ts.
    // Keeps the dashboard/catalog honest without a manual reload if data
    // changed elsewhere (another tab, the Postman collection, a teammate).
    refetchOnFocus: true,
    refetchOnReconnect: true,
    endpoints: (builder)=>({
            login: builder.mutation({
                query: (body)=>({
                        url: '/auth/login',
                        method: 'POST',
                        body
                    }),
                transformResponse: (res)=>res.data
            }),
            refresh: builder.mutation({
                query: ()=>({
                        url: '/auth/refresh',
                        method: 'POST'
                    }),
                transformResponse: (res)=>res.data
            }),
            logout: builder.mutation({
                query: ()=>({
                        url: '/auth/logout',
                        method: 'POST'
                    })
            }),
            getProducts: builder.query({
                query: (params)=>({
                        url: '/products',
                        params: params || undefined
                    }),
                transformResponse: (res)=>({
                        data: res.data,
                        meta: res.meta
                    }),
                providesTags: (result)=>result ? [
                        ...result.data.map((p)=>({
                                type: 'Product',
                                id: p.id
                            })),
                        {
                            type: 'Product',
                            id: 'LIST'
                        }
                    ] : [
                        {
                            type: 'Product',
                            id: 'LIST'
                        }
                    ]
            }),
            getProduct: builder.query({
                query: (id)=>`/products/${id}`,
                transformResponse: (res)=>res.data,
                providesTags: (result, error, id)=>[
                        {
                            type: 'Product',
                            id
                        }
                    ]
            }),
            createProduct: builder.mutation({
                query: (formData)=>({
                        url: '/products',
                        method: 'POST',
                        body: formData
                    }),
                transformResponse: (res)=>res.data,
                invalidatesTags: [
                    {
                        type: 'Product',
                        id: 'LIST'
                    },
                    'Analytics'
                ]
            }),
            updateProduct: builder.mutation({
                query: ({ id, formData })=>({
                        url: `/products/${id}`,
                        method: 'PATCH',
                        body: formData
                    }),
                transformResponse: (res)=>res.data,
                invalidatesTags: (result, error, { id })=>[
                        {
                            type: 'Product',
                            id
                        },
                        {
                            type: 'Product',
                            id: 'LIST'
                        },
                        'Analytics'
                    ]
            }),
            deleteProduct: builder.mutation({
                query: ({ id, hard })=>({
                        url: `/products/${id}${hard ? '?hard=true' : ''}`,
                        method: 'DELETE'
                    }),
                invalidatesTags: (result, error, { id })=>[
                        {
                            type: 'Product',
                            id
                        },
                        {
                            type: 'Product',
                            id: 'LIST'
                        },
                        'Analytics'
                    ]
            }),
            getAnalyticsSummary: builder.query({
                query: ()=>'/analytics/summary',
                transformResponse: (res)=>res.data,
                providesTags: [
                    'Analytics'
                ]
            }),
            getAnalyticsByCategory: builder.query({
                query: ()=>'/analytics/by-category',
                transformResponse: (res)=>res.data,
                providesTags: [
                    'Analytics'
                ]
            }),
            getAnalyticsByMonth: builder.query({
                query: ()=>'/analytics/by-month',
                transformResponse: (res)=>res.data,
                providesTags: [
                    'Analytics'
                ]
            }),
            getUpcomingWarranty: builder.query({
                query: ()=>'/analytics/upcoming-warranty',
                transformResponse: (res)=>res.data,
                providesTags: [
                    'Analytics'
                ]
            })
        })
});
const { useLoginMutation, useRefreshMutation, useLogoutMutation, useGetProductsQuery, useGetProductQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetAnalyticsSummaryQuery, useGetAnalyticsByCategoryQuery, useGetAnalyticsByMonthQuery, useGetUpcomingWarrantyQuery } = productsApi;
async function downloadProductsCsv(accessToken) {
    const res = await fetch(`${API_BASE_URL}/products/export/csv`, {
        headers: accessToken ? {
            Authorization: `Bearer ${accessToken}`
        } : undefined,
        credentials: 'include'
    });
    if (!res.ok) throw new Error('CSV export failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gadget-purchases.csv';
    a.click();
    URL.revokeObjectURL(url);
}
}),
"[project]/src/lib/features/authSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSessionExpiredNotice",
    ()=>clearSessionExpiredNotice,
    "default",
    ()=>__TURBOPACK__default__export__,
    "logout",
    ()=>logout,
    "sessionExpired",
    ()=>sessionExpired,
    "setCredentials",
    ()=>setCredentials
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    accessToken: null,
    isAuthenticated: false,
    sessionExpiredNotice: null
};
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action)=>{
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
        logout: (state)=>{
            state.accessToken = null;
            state.isAuthenticated = false;
        },
        sessionExpired: (state, action)=>{
            state.accessToken = null;
            state.isAuthenticated = false;
            state.sessionExpiredNotice = action.payload;
        },
        clearSessionExpiredNotice: (state)=>{
            state.sessionExpiredNotice = null;
        }
    }
});
const { setCredentials, logout, sessionExpired, clearSessionExpiredNotice } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
}),
"[project]/src/lib/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$productsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/productsApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features/authSlice.ts [app-ssr] (ecmascript)");
;
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$productsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productsApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$productsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productsApi"].reducer,
        auth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$productsApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productsApi"].middleware)
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setupListeners"])(store.dispatch);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__01y_ny5._.js.map