'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRefreshMutation } from './api/productsApi';
import { setCredentials } from './features/authSlice';

/**
 * On first load, silently tries /auth/refresh against the httpOnly refresh
 * cookie (if any). This is what lets a page reload keep the owner signed in
 * without storing the access token anywhere persistent (spec §9.3).
 */
export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const unblock = () => { if (!cancelled) setReady(true); };

    // Hard ceiling: no single network call — a cold Vercel function, a
    // slow database wake-up, a flaky edge hop — is allowed to freeze the
    // entire site on this screen forever. Worst case, a slow/failed
    // refresh just means the visitor loads as a public (logged-out) user
    // instead of staying silently stuck.
    const timeout = setTimeout(unblock, 4000);

    refresh()
      .unwrap()
      .then((data) => { if (!cancelled) dispatch(setCredentials({ accessToken: data.accessToken })); })
      .catch(() => { /* no valid refresh cookie, or the request failed — stay a public visitor */ })
      .finally(() => { clearTimeout(timeout); unblock(); });

    return () => { cancelled = true; clearTimeout(timeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <span className="font-mono text-xs uppercase tracking-widest opacity-50">Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}
