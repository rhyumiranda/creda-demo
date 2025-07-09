import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Pocketbase from "pocketbase";

export const pb = new Pocketbase('https://creda.fly.dev/');

// Global state
let globalSecretKey: string | null = null;
let tokenCache: any = null;

// Initialize SDK with secret key
export function initializeLoyalty(secretKey: string) {
  globalSecretKey = secretKey;
  tokenCache = null;
}

// Get validated token from cache or database
export async function getValidatedToken() {
  if (!globalSecretKey) {
    throw new Error('SDK not initialized. Call initializeLoyalty(secretKey) first.');
  }
  
  if (!tokenCache) {
    tokenCache = await pb.collection('tokens').getFirstListItem(`secret_key="${globalSecretKey}"`);
  }
  
  return tokenCache;
}

// Find user by email
export async function findUserByEmail(email: string) {
  const users = await pb.collection('users').getFullList({
    fields: '*'
  });
  
  const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error(`User not found with email: ${email}`);
  }
  
  return user;
}

// Create user if doesn't exist
export async function createUser(email: string) {
  const user = await pb.collection('users').create({
    email: email
  });
  
  return user;
}

// Find or create user by email
export async function findOrCreateUser(email: string) {
  try {
    return await findUserByEmail(email);
  } catch (error) {
    return await createUser(email);
  }
}

// Find wallet by user ID and token ID
export async function findWallet(userId: string, tokenId: string) {
  const wallet = await pb.collection('wallets').getFirstListItem(`user="${userId}" && token="${tokenId}"`);
  return wallet;
}

// Create wallet for user and token
export async function createWallet(userId: string, tokenId: string, initialBalance: number = 0) {
  const wallet = await pb.collection('wallets').create({
    user: userId,
    token: tokenId,
    balance: initialBalance
  });
  
  return wallet;
}

// Find or create wallet
export async function findOrCreateWallet(userId: string, tokenId: string, initialBalance: number = 0) {
  try {
    return await findWallet(userId, tokenId);
  } catch (error) {
    return await createWallet(userId, tokenId, initialBalance);
  }
}

// Update wallet balance
export async function updateWalletBalance(walletId: string, newBalance: number) {
  const wallet = await pb.collection('wallets').update(walletId, {
    balance: newBalance
  });
  
  return wallet;
}

// Mint tokens to user
export async function mint(email: string, amount: number) {
  const token = await getValidatedToken();
  const user = await findOrCreateUser(email);
  const wallet = await findOrCreateWallet(user.id, token.id, 0);
  
  const newBalance = wallet.balance + amount;
  const updatedWallet = await updateWalletBalance(wallet.id, newBalance);
  
  return {
    user: user,
    wallet: updatedWallet,
    mintedAmount: amount,
    newBalance: newBalance
  };
}

// Get user balance by email
export async function getBalance(email: string) {
  const token = await getValidatedToken();
  const user = await findUserByEmail(email);
  const wallet = await findWallet(user.id, token.id);
  
  return wallet.balance || 0;
}

// Validate token transfer between users
export async function validateTokenTransfer(fromUserId: string, toUserId: string, tokenId: string) {
  // Check if sender has wallet for this token type
  const fromWallet = await findWallet(fromUserId, tokenId);
  
  // Create or find recipient wallet for the same token type
  const toWallet = await findOrCreateWallet(toUserId, tokenId, 0);
  
  return { fromWallet, toWallet };
}

// Distribute tokens between users (same token type only)
export async function distribute(fromEmail: string, toEmail: string, amount: number) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  // Get the current token (from secret key)
  const token = await getValidatedToken();
  
  // Find users
  const fromUser = await findUserByEmail(fromEmail);
  const toUser = await findOrCreateUser(toEmail);
  
  // Validate both users can transfer this token type
  const { fromWallet, toWallet } = await validateTokenTransfer(fromUser.id, toUser.id, token.id);
  
  // Check if sender has sufficient balance
  if (fromWallet.balance < amount) {
    throw new Error(`Insufficient balance. Current balance: ${fromWallet.balance}, requested: ${amount}`);
  }
  
  // Calculate new balances
  const newFromBalance = fromWallet.balance - amount;
  const newToBalance = toWallet.balance + amount;
  
  // Update both wallets
  const updatedFromWallet = await updateWalletBalance(fromWallet.id, newFromBalance);
  const updatedToWallet = await updateWalletBalance(toWallet.id, newToBalance);
  
  return {
    fromUser: fromUser,
    toUser: toUser,
    fromWallet: updatedFromWallet,
    toWallet: updatedToWallet,
    token: token,
    transferAmount: amount,
    fromBalance: newFromBalance,
    toBalance: newToBalance
  };
}

// Test connection to Pocketbase
export async function testConnection() {
  const health = await pb.health.check();
  return health;
}

// Get all records for debugging
export async function debugRecords() {
  const [tokens, users, wallets] = await Promise.all([
    pb.collection('tokens').getFullList(),
    pb.collection('users').getFullList({ fields: '*' }),
    pb.collection('wallets').getFullList()
  ]);
  
  return { tokens, users, wallets };
}

// Burn tokens from user wallet
export async function burn(email: string, amount: number) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  const token = await getValidatedToken();
  const user = await findUserByEmail(email);
  const wallet = await findWallet(user.id, token.id);
  
  // Check if user has sufficient balance
  if (wallet.balance < amount) {
    throw new Error(`Insufficient balance. Current balance: ${wallet.balance}, requested to burn: ${amount}`);
  }
  
  // Calculate new balance after burning
  const newBalance = wallet.balance - amount;
  const updatedWallet = await updateWalletBalance(wallet.id, newBalance);
  
  return {
    user: user,
    wallet: updatedWallet,
    burnedAmount: amount,
    newBalance: newBalance,
    previousBalance: wallet.balance
  };
}

// Utility function for CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}