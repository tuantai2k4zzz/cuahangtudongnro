'use client';

import * as React from 'react';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId?: string | null) => boolean;
  toggleWishlist: (productId?: string | null) => void;
  wishlistCount: number;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'tudongnro_wishlist_ids';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Sanitize IDs: must be valid non-empty string and not the literal 'undefined' or 'null'
          const validIds = parsed.filter(
            (id): id is string =>
              typeof id === 'string' &&
              id.trim().length > 0 &&
              id !== 'undefined' &&
              id !== 'null'
          );
          setWishlistIds(validIds);
        }
      }
    } catch {
      setWishlistIds([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  React.useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isInitialized]);

  const isInWishlist = React.useCallback(
    (productId?: string | null) => {
      if (!productId || typeof productId !== 'string' || productId === 'undefined') {
        return false;
      }
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const toggleWishlist = React.useCallback(
    (productId?: string | null) => {
      if (!productId || typeof productId !== 'string' || productId === 'undefined') {
        return;
      }
      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev.filter((id) => id && id !== 'undefined'), productId]
      );
    },
    []
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistIds.length,
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
