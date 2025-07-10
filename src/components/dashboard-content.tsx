"use client"

import { useState, useEffect } from "react"
import { WalletSection } from "./wallet-section"
import { QuestSection } from "./quest-section"
import { SendModal } from "./send-modal"
import { ReceiveModal } from "./receive-modal"
import { ShopSection } from "./shop-section"
import { 
  initializeLoyalty, 
  balance, 
  mint, 
  distribute, 
  burn, 
  loginWithGitHub, 
  logout, 
  isAuthenticated, 
  getCurrentUser,
  getCurrentUserEmail 
} from "@/lib/creda-sdk"

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export interface UserData {
  coins: number
  coinValue: number
  coinSymbol: string
  coinName: string
  usdEquivalent: number
  marketCap: number
  circulatingSupply: number
  maxSupply: number
}

export default function DashboardContent() {
  const [userData, setUserData] = useState<UserData>({
    coins: 0,
    coinValue: 0,
    coinSymbol: "CRD",
    coinName: "CredaCoin",
    usdEquivalent: 0,
    marketCap: 0,
    circulatingSupply: 0,
    maxSupply: 0
  })

  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [receiveModalOpen, setReceiveModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setAuthenticated(true)
        setCurrentUser(getCurrentUser())
        
        // Initialize SDK and load data
        initializeLoyalty()
        await loadUserData()
      }
    }
    
    checkAuth()
  }, [])

  // Auto-refresh data every 30 seconds when authenticated
  useEffect(() => {
    if (!authenticated) return
    
    const interval = setInterval(loadUserData, 30000)
    return () => clearInterval(interval)
  }, [authenticated])

  // Load user wallet data and token stats
  const loadUserData = async () => {
    if (!authenticated) return
    
    setLoading(true)
    try {
      // Get user balance using authenticated user's email
      const userBalance = await balance()
      
      // Get token stats by minting 0 tokens (to get stats without changing balance)
      const mintResult = await mint(undefined, 0)
      const tokenStats = mintResult.tokenStats
      
      // Calculate USD equivalent
      const usdEquivalent = userBalance * tokenStats.price
      
      setUserData({
        coins: userBalance,
        coinValue: tokenStats.price,
        coinSymbol: tokenStats.token.symbol || "CRD",
        coinName: tokenStats.token.name || "CredaCoin",
        usdEquivalent: usdEquivalent,
        marketCap: tokenStats.marketCap,
        circulatingSupply: tokenStats.circulatingSupply,
        maxSupply: tokenStats.maxSupply
      })
      
      setError(null)
    } catch (err: any) {
      setError(`Failed to load user data: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle GitHub login
  const handleGitHubLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const authData = await loginWithGitHub()
      setAuthenticated(true)
      setCurrentUser(authData.record)

      // Initialize SDK and load data
      initializeLoyalty()
      await loadUserData()
    } catch (err: any) {
      setError(`Login failed: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    setAuthenticated(false)
    setCurrentUser(null)
    setUserData({
      coins: 0,
      coinValue: 0,
      coinSymbol: "CRD",
      coinName: "CredaCoin",
      usdEquivalent: 0,
      marketCap: 0,
      circulatingSupply: 0,
      maxSupply: 0
    })
  }

  // Handle send coins
  const handleSendCoins = async (recipientEmail: string, amount: number) => {
    if (!authenticated) return
    
    try {
      setLoading(true)
      await distribute(undefined, recipientEmail, amount)
      setSendModalOpen(false)
      await loadUserData() // Refresh data
    } catch (err: any) {
      setError(`Send failed: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle receive coins (mint for demo purposes)
  const handleReceiveCoins = async (amount: number) => {
    if (!authenticated) return
    
    try {
      setLoading(true)
      await mint(undefined, amount)
      setReceiveModalOpen(false)
      await loadUserData() // Refresh data
    } catch (err: any) {
      setError(`Receive failed: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle purchase (burn tokens)
  const handlePurchase = async (cost: number): Promise<boolean> => {
    if (!authenticated) return false
    
    try {
      setLoading(true)
      await burn(undefined, cost)
      await loadUserData() // Refresh data
      return true
    } catch (err: any) {
      setError(`Purchase failed: ${err.message || err}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Handle quest completion (mint reward)
  const handleQuestComplete = async (earned: number) => {
    if (!authenticated) return
    
    try {
      await mint(undefined, earned)
      await loadUserData() // Refresh data
    } catch (err: any) {
      setError(`Quest reward failed: ${err.message || err}`)
    }
  }

  // Show login screen if not authenticated
  if (!authenticated) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Creda Dashboard</h1>
          <p className="text-gray-600 mb-6">Please log in with GitHub to access your wallet</p>
          
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                Login with GitHub
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 wrapper">
      <div className="border-b border-border pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {currentUser?.name || currentUser?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Loading wallet data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">Error:</p>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="space-y-4">
        <WalletSection
          coins={userData.coins}
          coinValue={userData.coinValue}
          coinSymbol={userData.coinSymbol}
          onSendClick={() => setSendModalOpen(true)}
          onReceiveClick={() => setReceiveModalOpen(true)}
        />
        
        {/* Additional Token Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-800">USD Equivalent</div>
            <div className="text-2xl font-bold text-green-900">
              ${userData.usdEquivalent.toFixed(2)}
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-800">Token Price</div>
            <div className="text-2xl font-bold text-blue-900">
              ${userData.coinValue.toFixed(6)}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm font-medium text-purple-800">Market Cap</div>
            <div className="text-2xl font-bold text-purple-900">
              ${userData.marketCap.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Token Supply Info */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Circulating Supply:</span>
              <span className="font-semibold ml-2">{userData.circulatingSupply.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Max Supply:</span>
              <span className="font-semibold ml-2">{userData.maxSupply.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500">Supply Ratio</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(userData.circulatingSupply / userData.maxSupply) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <button
            onClick={loadUserData}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      <QuestSection
        coinSymbol={userData.coinSymbol}
        onQuestComplete={handleQuestComplete}
      />

      <ShopSection coins={userData.coins} onPurchase={handlePurchase} />

      {/* Modals */}
      <SendModal
        open={sendModalOpen}
        onOpenChange={setSendModalOpen}
        maxAmount={userData.coins}
        coinSymbol={userData.coinSymbol}
        onSend={handleSendCoins}
      />

      <ReceiveModal
        open={receiveModalOpen}
        onOpenChange={setReceiveModalOpen}
        coinSymbol={userData.coinSymbol}
        onReceive={handleReceiveCoins}
      />
    </div>
  )
}