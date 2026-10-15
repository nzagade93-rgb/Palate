import { useState, useEffect } from 'react';
import type { Dish, VaultItem, VaultTab } from '../types';

const VAULT_STORAGE_KEY = 'palate_user_vault_v1';

// Seed default initial items if first time
const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-init-1',
    dishId: 'dish-btc-pavbhaji',
    dishName: 'Special Amul Butter Pav Bhaji',
    venueName: 'Bhagat Tarachand',
    venueArea: 'Sector 17, Vashi',
    price: 190,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80',
    status: 'LOVED',
    userNotes: 'Ask for the double roasted kadak pav. Don\'t order the pulav here!',
    updatedAt: Date.now() - 86400000 * 2,
    tags: ['Legendary Pav', 'Must Go Before 8PM']
  },
  {
    id: 'vault-init-2',
    dishId: 'dish-moru-dalpakwan',
    dishName: 'Sunday Morning Dal Pakwan',
    venueName: 'Morumal Sweets & Snacks',
    venueArea: 'Sector 17, Vashi',
    price: 110,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    status: 'SAVED',
    userNotes: 'Go before 9:45 AM on Sunday to beat the massive crowd.',
    updatedAt: Date.now() - 86400000,
    tags: ['Breakfast', 'Sindhi']
  },
  {
    id: 'vault-init-3',
    dishId: 'skip-kathi-1',
    dishName: 'Paneer Tikka Roll',
    venueName: 'Kathi Rolls Corner',
    venueArea: 'Arenja Corner, Sec 17',
    price: 150,
    verdict: 'SKIP',
    scorePercent: 25,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80',
    status: 'AVOID',
    userNotes: 'Rubbery cold paneer cubes drenched in sweet mayo. Never again. Stick to Double Chicken Egg.',
    updatedAt: Date.now() - 86400000 * 4,
    tags: ['Regret', 'Rubbery']
  }
];

export function useVault() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    try {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading vault from localStorage', e);
    }
    return INITIAL_VAULT_ITEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vaultItems));
    } catch (e) {
      console.error('Error persisting vault to localStorage', e);
    }
  }, [vaultItems]);

  const saveDishToVault = (dish: Dish, status: VaultTab = 'SAVED', customNote: string = '') => {
    setVaultItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.dishId === dish.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status,
          userNotes: customNote || updated[existingIndex].userNotes,
          updatedAt: Date.now()
        };
        return updated;
      }

      const newItem: VaultItem = {
        id: `vault-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        dishId: dish.id,
        dishName: dish.name,
        venueName: dish.venueName,
        venueArea: dish.venueArea,
        price: dish.price,
        verdict: dish.verdict,
        scorePercent: dish.scorePercent,
        imageUrl: dish.imageUrl,
        status,
        userNotes: customNote || dish.microVerdict,
        updatedAt: Date.now()
      };
      return [newItem, ...prev];
    });
  };

  const updateVaultNote = (id: string, notes: string, status?: VaultTab) => {
    setVaultItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              userNotes: notes,
              ...(status ? { status } : {}),
              updatedAt: Date.now()
            }
          : item
      )
    );
  };

  const updateVaultStatus = (id: string, status: VaultTab) => {
    setVaultItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, updatedAt: Date.now() } : item))
    );
  };

  const removeVaultItem = (id: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isDishSaved = (dishId: string): { saved: boolean; item?: VaultItem } => {
    const item = vaultItems.find((i) => i.dishId === dishId);
    return { saved: Boolean(item), item };
  };

  const addCustomVaultItem = (itemData: Omit<VaultItem, 'id' | 'updatedAt'>) => {
    const newItem: VaultItem = {
      ...itemData,
      id: `vault-custom-${Date.now()}`,
      updatedAt: Date.now()
    };
    setVaultItems((prev) => [newItem, ...prev]);
  };

  return {
    vaultItems,
    saveDishToVault,
    updateVaultNote,
    updateVaultStatus,
    removeVaultItem,
    isDishSaved,
    addCustomVaultItem
  };
}
