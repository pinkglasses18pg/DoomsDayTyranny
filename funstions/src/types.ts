// functions/src/types.ts

export interface User {
  telegramId: string;
  coins: number;
  gameStats: string;
  lastUpdate: number;
  username?: string; // New field
  referredParent?: string; // New field (optional)
  referralChildren?: {id: string, isRead: boolean}; // New field (optional)
}
