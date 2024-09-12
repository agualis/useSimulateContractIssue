import { useAccount, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { balancerV2VaultAbi } from '../abis/balancerV2VaultAbi';
import { chainId, relayerAddress, vaultAddress } from '../constants';
import { arbitrum } from 'wagmi/chains';
import { Address } from 'viem';


// Relayer approval
export function useTransactionStep({approve}: {approve: boolean}) {
  const {address: accountAddress}= useAccount()


  const simulateQuery = useSimulateContract({
    abi: balancerV2VaultAbi,
    address: vaultAddress,
    functionName: 'setRelayerApproval',
    args: [ accountAddress || '' as Address, relayerAddress, approve],
    chainId: arbitrum.id,
    query: {
      enabled: !!accountAddress,
    },
  })

  const writeMutation = useWriteContract()

  const receiptQuery = useWaitForTransactionReceipt({
    chainId ,
    hash: writeMutation.data,
  })

  function runTx() {
    if (!simulateQuery.data) return

    return writeMutation.writeContractAsync({...simulateQuery.data?.request, chainId})
  }

  return {
    simulateQuery,
    writeMutation,
    receiptQuery,
    runTx
  }
}
