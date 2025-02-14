import { useAppKitAccount  } from '@reown/appkit/react'

export const Text = () => {
  const { isConnected } = useAppKitAccount() // AppKit hook to get the address and check if the user is connected
  return (
    isConnected || 
    <div className={"description"}>
        Connect your wallet to open the Minting dApp.
    </div>
  )
}
