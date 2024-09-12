import { useAccount, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { balancerV2VaultAbi } from '../abis/balancerV2VaultAbi';
import { chainId, relayerAddress, vaultAddress } from '../constants';
import { arbitrum } from 'wagmi/chains';
import { Address } from 'viem';


// Relayer approval
export function useSecondTransaction() {
  const {address: accountAddress}= useAccount()

  const approve = false

  const simulateQuery2 = useSimulateContract({
    abi: balancerV2VaultAbi,
    address: vaultAddress,
    functionName: 'setRelayerApproval',
    args: [ accountAddress || '' as Address, relayerAddress, approve],
    chainId: arbitrum.id,
    query: {
      enabled: !!accountAddress,
    },
  })

  const writeMutation2 = useWriteContract()

  const receiptQuery2 = useWaitForTransactionReceipt({
    chainId ,
    hash: writeMutation2.data,
  })

  function runTx2() {
    if (!simulateQuery2.data) return

    return writeMutation2.writeContractAsync({...simulateQuery2.data?.request, chainId})
  }

  return {
     simulateQuery2,
     writeMutation2,
     receiptQuery2,
     runTx2
  }
}