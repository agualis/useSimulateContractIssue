import { waitFor } from '@testing-library/react'

import { Hash } from 'viem'
import { polygon } from 'viem/chains'
import { useWaitForTransactionReceipt } from 'wagmi'
import { testHook } from './test-helpers'

async function testSwapReceipt(txHash: Hash, chainId = polygon.id) {
  const { result } = testHook(() =>
    useWaitForTransactionReceipt({
      chainId,
      hash: txHash,
    })
  )
  return result
}

test('queries swap transaction', async () => {
  // https://polygonscan.com/tx/0x78ddd90502509a264a5e8f4f3732668db669e7614f4887f2a233ce39e5eafa7c
  const txHash = '0x78ddd90502509a264a5e8f4f3732668db669e7614f4887f2a233ce39e5eafa7c'

  const result = await testSwapReceipt(txHash, polygon.id)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data?.blockHash).toEqual(
    `0xd2b819c7954d28400167d12e859b28035341f87c7c68115613b0f3fa18bb9ab0`
  )
})
