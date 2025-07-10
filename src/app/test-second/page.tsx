"use client"

import { useState } from "react"
import { initializeLoyalty, mint, distribute, balance, burn } from "@/lib/creda-sdk"

export default function CredaSDKTest() {
  const [email, setEmail] = useState("")
  const [userBalance, setUserBalance] = useState<number | null>(null)
  const [secretKey, setSecretKey] = useState("")
  const [mintAmount, setMintAmount] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [toEmail, setToEmail] = useState("")
  const [distributeAmount, setDistributeAmount] = useState("")
  const [burnAmount, setBurnAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [mintResult, setMintResult] = useState<any>(null)
  const [distributeResult, setDistributeResult] = useState<any>(null)
  const [burnResult, setBurnResult] = useState<any>(null)

  // Reset error state
  const clearError = () => setError(null)

  // Set loading state
  const setLoadingState = (isLoading: boolean) => setLoading(isLoading)

  // Handle SDK initialization
  const handleInitialize = () => {
    try {
      initializeLoyalty(secretKey)
      setInitialized(true)
      clearError()
      console.log("✅ Creda SDK initialized")
    } catch (err) {
      setError(`Initialization failed: ${err}`)
    }
  }

  // Handle mint tokens
  const handleMint = async () => {
    if (!email || !mintAmount) {
      setError("Please enter email and mint amount")
      return
    }

    const amount = parseInt(mintAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive number")
      return
    }

    setLoadingState(true)
    clearError()
    
    try {
      const result = await mint(email, amount)
      setMintResult(result)
      console.log("✅ Mint successful:", result)
    } catch (err: any) {
      setError(`Mint failed: ${err.message || err}`)
    } finally {
      setLoadingState(false)
    }
  }

  // Handle distribute tokens
  const handleDistribute = async () => {
    if (!fromEmail || !toEmail || !distributeAmount) {
      setError("Please enter from email, to email, and amount")
      return
    }

    const amount = parseInt(distributeAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive number")
      return
    }

    setLoadingState(true)
    clearError()
    
    try {
      const result = await distribute(fromEmail, toEmail, amount)
      setDistributeResult(result)
      console.log("✅ Distribute successful:", result)
    } catch (err: any) {
      setError(`Distribute failed: ${err.message || err}`)
    } finally {
      setLoadingState(false)
    }
  }

  // Handle get balance
  const handleGetBalance = async () => {
    if (!email) {
      setError("Please enter an email")
      return
    }

    setLoadingState(true)
    clearError()
    
    try {
      const result = await balance(email)
      setUserBalance(result)
      console.log("✅ Balance retrieved:", result)
    } catch (err: any) {
      setError(`Get balance failed: ${err.message || err}`)
    } finally {
      setLoadingState(false)
    }
  }

  // Handle burn tokens
  const handleBurn = async () => {
    if (!email || !burnAmount) {
      setError("Please enter email and burn amount")
      return
    }

    const amount = parseInt(burnAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive number")
      return
    }

    setLoadingState(true)
    clearError()
    
    try {
      const result = await burn(email, amount)
      setBurnResult(result)
      console.log("✅ Burn successful:", result)
    } catch (err: any) {
      setError(`Burn failed: ${err.message || err}`)
    } finally {
      setLoadingState(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Creda SDK Test</h1>
      
      {/* Initialize Section */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Initialize SDK</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Secret Key:</label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your secret key"
          />
        </div>
        <button
          onClick={handleInitialize}
          disabled={!secretKey}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Initialize SDK
        </button>
        {initialized && <p className="text-green-600 mt-2">✅ SDK Initialized</p>}
      </div>

      {/* Core Functions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mint Section */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">Mint Tokens</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount:</label>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="100"
              />
            </div>
            <button
              onClick={handleMint}
              disabled={loading || !initialized || !email || !mintAmount}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Minting..." : "Mint"}
            </button>
          </div>
        </div>

        {/* Burn Section */}
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-red-800">Burn Tokens</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount:</label>
              <input
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="50"
              />
            </div>
            <button
              onClick={handleBurn}
              disabled={loading || !initialized || !email || !burnAmount}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Burning..." : "Burn"}
            </button>
          </div>
        </div>

        {/* Distribute Section */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-orange-800">Distribute Tokens</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">From Email:</label>
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="sender@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Email:</label>
              <input
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount:</label>
              <input
                type="number"
                value={distributeAmount}
                onChange={(e) => setDistributeAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="25"
              />
            </div>
            <button
              onClick={handleDistribute}
              disabled={loading || !initialized || !fromEmail || !toEmail || !distributeAmount}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Distributing..." : "Distribute"}
            </button>
          </div>
        </div>

        {/* Balance Section */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-green-800">Check Balance</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="user@example.com"
              />
            </div>
            <button
              onClick={handleGetBalance}
              disabled={loading || !initialized || !email}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get Balance"}
            </button>
            {userBalance !== null && (
              <div className="p-2 bg-green-100 rounded text-center">
                <p className="text-green-800 font-semibold">Balance: {userBalance}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8 space-y-4">
        {mintResult && (
          <div className="p-4 bg-purple-100 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Mint Result:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Minted Amount:</p>
                <p className="font-semibold">{mintResult.mintedAmount}</p>
              </div>
              <div>
                <p className="text-gray-600">New Balance:</p>
                <p className="font-semibold">{mintResult.newBalance}</p>
              </div>
              <div>
                <p className="text-gray-600">Token Price:</p>
                <p className="font-semibold">${mintResult.tokenStats.price}</p>
              </div>
              <div>
                <p className="text-gray-600">Market Cap:</p>
                <p className="font-semibold">${mintResult.tokenStats.marketCap.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {distributeResult && (
          <div className="p-4 bg-orange-100 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Distribute Result:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Transfer Amount:</p>
                <p className="font-semibold">{distributeResult.transferAmount}</p>
              </div>
              <div>
                <p className="text-gray-600">From Balance:</p>
                <p className="font-semibold">{distributeResult.fromBalance}</p>
              </div>
              <div>
                <p className="text-gray-600">To Balance:</p>
                <p className="font-semibold">{distributeResult.toBalance}</p>
              </div>
              <div>
                <p className="text-gray-600">Token Price:</p>
                <p className="font-semibold">${distributeResult.tokenStats.price}</p>
              </div>
            </div>
          </div>
        )}

        {burnResult && (
          <div className="p-4 bg-red-100 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Burn Result:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Burned Amount:</p>
                <p className="font-semibold">{burnResult.burnedAmount}</p>
              </div>
              <div>
                <p className="text-gray-600">Previous Balance:</p>
                <p className="font-semibold">{burnResult.previousBalance}</p>
              </div>
              <div>
                <p className="text-gray-600">New Balance:</p>
                <p className="font-semibold">{burnResult.newBalance}</p>
              </div>
              <div>
                <p className="text-gray-600">Token Price:</p>
                <p className="font-semibold">${burnResult.tokenStats.price}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-red-800 font-semibold">Error:</p>
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}