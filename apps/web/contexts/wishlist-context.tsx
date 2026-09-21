'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId?: string | null) => boolean;
  toggleWishlist: (productId?: string | null) => boolean;
  wishlistCount: number;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [wishlistIds, setWishlistIds] = React.useState<string[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const userId = React.useMemo(() => {
    if (!isAuthenticated || !user) return null;
    return (user.id || (user as any)._id)?.toString() || user.email;
  }, [user, isAuthenticated]);

  const storageKey = React.useMemo(() => {
    return userId ? `tudongnro_wishlist_${userId}` : null;
  }, [userId]);

  // Load user's wishlist whenever active user changes
  React.useEffect(() => {
    if (!userId || !storageKey) {
      setWishlistIds([]);
      setIsInitialized(true);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validIds = parsed.filter(
            (id): id is string =>
              typeof id === 'string' &&
              id.trim().length > 0 &&
              id !== 'undefined' &&
              id !== 'null'
          );
          setWishlistIds(validIds);
        } else {
          setWishlistIds([]);
        }
      } else {
        setWishlistIds([]);
      }
    } catch {
      setWishlistIds([]);
    } finally {
      setIsInitialized(true);
    }
  }, [userId, storageKey]);

  // Save to user's storage key whenever wishlistIds changes
  React.useEffect(() => {
    if (isInitialized && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isInitialized, storageKey]);

  const isInWishlist = React.useCallback(
    (productId?: string | null) => {
      if (!isAuthenticated || !productId || typeof productId !== 'string' || productId === 'undefined') {
        return false;
      }
      return wishlistIds.includes(productId);
    },
    [isAuthenticated, wishlistIds]
  );

  const toggleWishlist = React.useCallback(
    (productId?: string | null): boolean => {
      if (!isAuthenticated) {
        toast.showToast({
          type: 'WARNING',
          title: 'Yêu cầu đăng nhập',
          message: 'Vui lòng đăng nhập để lưu và quản lý sản phẩm yêu thích!',
        });
        router.push('/login');
        return false;
      }

      if (!productId || typeof productId !== 'string' || productId === 'undefined') {
        return false;
      }

      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev.filter((id) => id && id !== 'undefined'), productId]
      );
      return true;
    },
    [isAuthenticated, router, toast]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: isAuthenticated ? wishlistIds : [],
        isInWishlist,
        toggleWishlist,
        wishlistCount: isAuthenticated ? wishlistIds.length : 0,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
