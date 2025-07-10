"use client"
import { useState } from "react"
import { initializeLoyalty, getBalance, mint, distribute, burn, getTokenStats, debugRecords, testConnection } from "@/lib/utils"

export default function LoyaltyTest() {
  const [email, setEmail] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
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
  const [tokenStats, setTokenStats] = useState<any>(null)

  // Reset error state
  const clearError = () => setError(null)

  // Set loading state
  const setLoadingState = (isLoading: boolean) => setLoading(isLoading)

  // Handle get token stats
  const handleGetTokenStats = async () => {
    setLoadingState(true)
    clearError()
    
    try {
      const stats = await getTokenStats()
      setTokenStats(stats)
      console.log("✅ Token stats retrieved:", stats)
    } catch (err: any) {
      setError(`Get token stats failed: ${err.message || err}`)
    } finally {
      setLoadingState(false)
    }
  }

  // Handle test connection
  const handleTestConnection = async () => {
    setLoadingState(true)
    clearError()
    
    try {
      await testConnection()
      console.log("✅ Connection test passed")
    } catch (err) {
      setError(`Connection test failed: ${err}`)
    } finally {
      setLoadingState(false)
    }
  }

  // Handle debug records
  const handleDebugRecords = async () => {
    setLoadingState(true)
    clearError()
    
    try {
      const records = await debugRecords()
      console.log("📋 Debug results:", records)
    } catch (err) {
      setError(`Debug failed: ${err}`)
    } finally {
      setLoadingState(false)
    }
  }

  // Handle SDK initialization
  const handleInitialize = () => {
    try {
      initializeLoyalty(secretKey)
      setInitialized(true)
      clearError()
      console.log("✅ Loyalty SDK initialized")
    } catch (err) {
      setError(`Initialization failed: ${err}`)
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
      const userBalance = await getBalance(email)
      setBalance(userBalance)
      console.log("✅ Balance retrieved:", userBalance)
    } catch (err: any) {
      setError(`Get balance failed: ${err.message || err}`)
    } finally {
      setLoadingState(false)
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
      setTokenStats(result.tokenStats)
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
      setTokenStats(result.tokenStats)
      console.log("✅ Distribute successful:", result)
    } catch (err: any) {
      setError(`Distribute failed: ${err.message || err}`)
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
      setTokenStats(result.tokenStats)
      console.log("✅ Burn successful:", result)
    } catch (err: any) {
      setError(`Burn failed: ${err.message || err}`)
    } finally {
      setLoadingState(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Loyalty SDK Test</h2>
      
      <ConnectionTestSection 
        loading={loading}
        onTestConnection={handleTestConnection}
        onDebugRecords={handleDebugRecords}
        onGetTokenStats={handleGetTokenStats}
      />
      
      <InitializeSection 
        secretKey={secretKey}
        initialized={initialized}
        onSecretKeyChange={setSecretKey}
        onInitialize={handleInitialize}
      />

      <TokenStatsSection 
        tokenStats={tokenStats}
        loading={loading}
        initialized={initialized}
        onGetStats={handleGetTokenStats}
      />

      <MintSection 
        email={email}
        mintAmount={mintAmount}
        loading={loading}
        initialized={initialized}
        onEmailChange={setEmail}
        onMintAmountChange={setMintAmount}
        onMint={handleMint}
      />

      <BurnSection 
        email={email}
        burnAmount={burnAmount}
        loading={loading}
        initialized={initialized}
        onEmailChange={setEmail}
        onBurnAmountChange={setBurnAmount}
        onBurn={handleBurn}
      />

      <DistributeSection 
        fromEmail={fromEmail}
        toEmail={toEmail}
        distributeAmount={distributeAmount}
        loading={loading}
        initialized={initialized}
        onFromEmailChange={setFromEmail}
        onToEmailChange={setToEmail}
        onDistributeAmountChange={setDistributeAmount}
        onDistribute={handleDistribute}
      />

      <GetBalanceSection 
        email={email}
        loading={loading}
        initialized={initialized}
        onEmailChange={setEmail}
        onGetBalance={handleGetBalance}
      />

      <ResultsSection 
        balance={balance}
        mintResult={mintResult}
        distributeResult={distributeResult}
        burnResult={burnResult}
        error={error}
      />
    </div>
  )
}

// Connection test component
function ConnectionTestSection({ loading, onTestConnection, onDebugRecords, onGetTokenStats }: {
  loading: boolean
  onTestConnection: () => void
  onDebugRecords: () => void
  onGetTokenStats: () => void
}) {
  return (
    <div className="mb-6">
      <button
        onClick={onTestConnection}
        disabled={loading}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>
      <button
        onClick={onDebugRecords}
        disabled={loading}
        className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Debug Records"}
      </button>
      <button
        onClick={onGetTokenStats}
        disabled={loading}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Get Token Stats"}
      </button>
    </div>
  )
}

// Token stats section component
function TokenStatsSection({ tokenStats, loading, initialized, onGetStats }: {
  tokenStats: any
  loading: boolean
  initialized: boolean
  onGetStats: () => void
}) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Token Statistics</h3>
      {tokenStats && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded">
          <div>
            <p className="text-sm text-gray-600">Token Name</p>
            <p className="font-semibold">{tokenStats.token.name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Symbol</p>
            <p className="font-semibold">{tokenStats.token.symbol || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Circulating Supply</p>
            <p className="font-semibold">{tokenStats.circulatingSupply.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Max Supply</p>
            <p className="font-semibold">{tokenStats.maxSupply.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Price</p>
            <p className="font-semibold">${tokenStats.price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Market Cap</p>
            <p className="font-semibold">${tokenStats.marketCap.toLocaleString()}</p>
          </div>
        </div>
      )}
      <button
        onClick={onGetStats}
        disabled={loading || !initialized}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Refresh Stats"}
      </button>
    </div>
  )
}

// Initialize section component
function InitializeSection({ secretKey, initialized, onSecretKeyChange, onInitialize }: {
  secretKey: string
  initialized: boolean
  onSecretKeyChange: (value: string) => void
  onInitialize: () => void
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Secret Key:</label>
      <input
        type="password"
        value={secretKey}
        onChange={(e) => onSecretKeyChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter your secret key"
      />
      <button
        onClick={onInitialize}
        disabled={!secretKey}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Initialize SDK
      </button>
      {initialized && <p className="text-green-600 mt-1">✅ SDK Initialized</p>}
    </div>
  )
}

// Mint section component
function MintSection({ email, mintAmount, loading, initialized, onEmailChange, onMintAmountChange, onMint }: {
  email: string
  mintAmount: string
  loading: boolean
  initialized: boolean
  onEmailChange: (value: string) => void
  onMintAmountChange: (value: string) => void
  onMint: () => void
}) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Mint Tokens</h3>
      <label className="block text-sm font-medium mb-2">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="user@example.com"
      />
      <label className="block text-sm font-medium mb-2">Mint Amount:</label>
      <input
        type="number"
        value={mintAmount}
        onChange={(e) => onMintAmountChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="100"
      />
      <button
        onClick={onMint}
        disabled={loading || !initialized || !email || !mintAmount}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
      >
        {loading ? "Minting..." : "Mint Tokens"}
      </button>
    </div>
  )
}

// Burn section component
function BurnSection({ email, burnAmount, loading, initialized, onEmailChange, onBurnAmountChange, onBurn }: {
  email: string
  burnAmount: string
  loading: boolean
  initialized: boolean
  onEmailChange: (value: string) => void
  onBurnAmountChange: (value: string) => void
  onBurn: () => void
}) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Burn Tokens</h3>
      <label className="block text-sm font-medium mb-2">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="user@example.com"
      />
      <label className="block text-sm font-medium mb-2">Burn Amount:</label>
      <input
        type="number"
        value={burnAmount}
        onChange={(e) => onBurnAmountChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="50"
      />
      <button
        onClick={onBurn}
        disabled={loading || !initialized || !email || !burnAmount}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Burning..." : "Burn Tokens"}
      </button>
    </div>
  )
}

// Distribute section component
function DistributeSection({ fromEmail, toEmail, distributeAmount, loading, initialized, onFromEmailChange, onToEmailChange, onDistributeAmountChange, onDistribute }: {
  fromEmail: string
  toEmail: string
  distributeAmount: string
  loading: boolean
  initialized: boolean
  onFromEmailChange: (value: string) => void
  onToEmailChange: (value: string) => void
  onDistributeAmountChange: (value: string) => void
  onDistribute: () => void
}) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Distribute Tokens</h3>
      <label className="block text-sm font-medium mb-2">From Email:</label>
      <input
        type="email"
        value={fromEmail}
        onChange={(e) => onFromEmailChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="sender@example.com"
      />
      <label className="block text-sm font-medium mb-2">To Email:</label>
      <input
        type="email"
        value={toEmail}
        onChange={(e) => onToEmailChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="recipient@example.com"
      />
      <label className="block text-sm font-medium mb-2">Amount:</label>
      <input
        type="number"
        value={distributeAmount}
        onChange={(e) => onDistributeAmountChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="50"
      />
      <button
        onClick={onDistribute}
        disabled={loading || !initialized || !fromEmail || !toEmail || !distributeAmount}
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Distributing..." : "Distribute Tokens"}
      </button>
    </div>
  )
}

// Get balance section component
function GetBalanceSection({ email, loading, initialized, onEmailChange, onGetBalance }: {
  email: string
  loading: boolean
  initialized: boolean
  onEmailChange: (value: string) => void
  onGetBalance: () => void
}) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Check Balance</h3>
      <label className="block text-sm font-medium mb-2">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="user@example.com"
      />
      <button
        onClick={onGetBalance}
        disabled={loading || !initialized || !email}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Get Balance"}
      </button>
    </div>
  )
}

// Results section component
function ResultsSection({ balance, mintResult, distributeResult, burnResult, error }: {
  balance: number | null
  mintResult: any
  distributeResult: any
  burnResult: any
  error: string | null
}) {
  return (
    <>
      {mintResult && (
        <div className="mb-4 p-3 bg-purple-100 rounded">
          <p className="text-purple-800 font-semibold">Mint Successful!</p>
          <p className="text-purple-700">Amount: {mintResult.mintedAmount}</p>
          <p className="text-purple-700">New Balance: {mintResult.newBalance}</p>
        </div>
      )}

      {burnResult && (
        <div className="mb-4 p-3 bg-red-100 rounded">
          <p className="text-red-800 font-semibold">Burn Successful!</p>
          <p className="text-red-700">Amount Burned: {burnResult.burnedAmount}</p>
          <p className="text-red-700">Previous Balance: {burnResult.previousBalance}</p>
          <p className="text-red-700">New Balance: {burnResult.newBalance}</p>
        </div>
      )}

      {distributeResult && (
        <div className="mb-4 p-3 bg-orange-100 rounded">
          <p className="text-orange-800 font-semibold">Distribution Successful!</p>
          <p className="text-orange-700">Token: {distributeResult.token.name || 'Token'}</p>
          <p className="text-orange-700">Amount: {distributeResult.transferAmount}</p>
          <p className="text-orange-700">From Balance: {distributeResult.fromBalance}</p>
          <p className="text-orange-700">To Balance: {distributeResult.toBalance}</p>
        </div>
      )}

      {balance !== null && (
        <div className="mb-4 p-3 bg-green-100 rounded">
          <p className="text-green-800">Balance: {balance}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </>
  )
}