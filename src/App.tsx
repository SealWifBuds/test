import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { projectId, metadata, networks, wagmiAdapter } from './config'

import "./App.css"

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'dark' as const,
  themeVariables: {
    '--w3m-accent': '#0d76fc',
  }
}

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export function App() {
  return (
    <div className={"container"}>
       <div className={"main"}>
        <h1 className={"title"}>
          <a href="https://sealwifbuds.com">Seal Wif Buds</a> - NFT Minting dApp
        </h1>
        <p><img src="/logo.png" alt="Logo" style={{ width: '200px', height: '200px' }} /></p>
        <br/>
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <appkit-button/>
          </QueryClientProvider>
        </WagmiProvider>
      </div>
    </div>
  )
}

export default App
