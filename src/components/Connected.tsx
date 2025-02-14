// @ts-nocheck
import { useDisconnect, useAppKitAccount  } from '@reown/appkit/react'
import { type BaseError, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { abi } from '../data/NFTcontract.json'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

export const Connected = () => {
  const { disconnect } = useDisconnect(); // AppKit hook to disconnect
  const { isConnected } = useAppKitAccount() // AppKit hook to get the address and check if the user is connected

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const { data: totalSupplyData, refetch: getSupply } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "totalSupply",
  });

  const {data: mintPriceData, refetch: getPrice} = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: 'cost',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      getSupply(); 
      getPrice();
    }, 5000);// Ruft die Werte alle 5 Sekunden ab

    return () => clearInterval(interval); // Cleanup der Intervalle beim Unmounten
  }, [getSupply, getPrice]);

  const {data: maxMintAmountData} = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: 'maxMintAmount',
  });

  const {data: maxSupplyData} = useReadContract({
    abi,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: 'maxSupply',
  });

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()

  async function mint() {
    await writeContract({
      value: BigInt(mintPriceData) * BigInt(mintAmount),
      address: import.meta.env.VITE_CONTRACT_ADDRESS,
      abi,
      functionName: 'mint',
      args: [1]
    })
  }

  const { data: useWaitForTransactionReceiptData, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    console.log("mintPrice:", hash);
    console.log("mintPrice:", useWaitForTransactionReceiptData);
  }, [hash, useWaitForTransactionReceiptData]);

  const [mintAmount, setMintAmount] = useState(1);

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    const maxMint = !maxMintAmountData ? 3 : maxMintAmountData;
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > BigInt(maxMint) || 
    BigInt(totalSupplyData) + BigInt(newMintAmount) >
    BigInt(maxSupplyData)) {
      newMintAmount = mintAmount;
    }
    setMintAmount(newMintAmount);
  };


  return (
    isConnected && (
      <div className={"connected"}>
        <h1 className={"supply"}>{String(totalSupplyData)}  /{' '}{String(maxSupplyData)}</h1>
        <p className={"price"}>Total Price {formatEther(BigInt(mintPriceData) * BigInt(mintAmount))}</p>
        <p className={"price"}>
          <button disabled={isPending || isConfirming ? true : false} onClick={decrementMintAmount}>-</button>
          {mintAmount}
          <button disabled={isPending || isConfirming ? true : false} onClick={incrementMintAmount}>+</button>
          Mint Amount
        </p>
        <p>
          <button onClick={handleDisconnect}>Disconnect</button>
          <button onClick={mint}>{isPending || isConfirming ? 'Confirming...' : 'Mint NFTs'}</button>
        </p>
        {!isConfirming && !isConfirmed && <div className={"status"}><br/></div>}
        {isConfirming && <div className={"status"}>Waiting for confirmation...</div>}
        {isConfirmed && <div className={"status"}>Transaction confirmed.</div>}
        {!isConfirming && !isConfirmed && <div className={"hash"}><br/></div>}
        {hash && <div className={"hash"}>Transaction Hash: {hash}</div>}
        {error && ( 
          <div>Error: {(error as BaseError).shortMessage || error.message }</div>
        )}
        <div className={"grid"}>
          <div className={"card"}>
            <h2>Live Price</h2>
            <p>{formatEther(BigInt(mintPriceData))} ETH ≈ $100</p>
          </div>
        </div>
        <div className={"grid"}>
          <div className={"card"}>
            <h2>Allocation of funds</h2>
            <p>Two-thirds of the purchase price will automatically buy $SWIFB tokens. Half will be paired with the remaining ETH and added directly to liquidity.</p>
          </div>
          <div className={"card"}>
            <h2>Airdrop</h2>
            <p>Once we sell out the mint, every NFT holder will receive an airdrop of $100 in $SWIFB, making these NFTs effectively free.</p>
          </div>
        </div>
    </div>
    )
  )
}
