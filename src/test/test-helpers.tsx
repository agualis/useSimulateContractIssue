/* eslint-disable react-refresh/only-export-components */
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, RenderHookOptions } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { Address, Hex, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createConfig, WagmiProvider } from 'wagmi'
import { mock } from 'wagmi/connectors'
import { polygonTest } from '../../test/anvil/anvil-global-setup'


export const defaultAnvilTestPrivateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
// anvil account address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
const defaultTestUserAccount = privateKeyToAccount(defaultAnvilTestPrivateKey as Hex).address

const testAccounts: Address[] = [
  // Wagmi accounts
  defaultTestUserAccount,
]

function createTestWagmiConfig() {
  return createConfig({
    chains: [polygonTest],
    connectors: testAccounts.map(testAccount => mock({ accounts: [testAccount] })),
    pollingInterval: 100,
    storage: null,
    transports: {
      [polygonTest.id]: http(),
    },
    ssr: false,
  })
}

const testWagmiConfig = createTestWagmiConfig()

export const EmptyWrapper = ({ children }: PropsWithChildren) => <>{children}</>

export function testHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> | undefined
) {
  function MixedProviders({ children }: PropsWithChildren) {
    const LocalProviders = options?.wrapper || EmptyWrapper

    return (
      <GlobalProviders>
        <LocalProviders>{children}</LocalProviders>
      </GlobalProviders>
    )
  }

  const result = renderHook<TResult, TProps>(hook, {
    ...options,
    wrapper: MixedProviders as React.ComponentType<{ children: React.ReactNode }>,
  })

  return {
    ...result,
  }
}

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent vitest from garbage collecting cache
      gcTime: Infinity,

      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: e => {
      console.error('Error in query:', e)
    },
  }),
})

function GlobalProviders({ children }: PropsWithChildren) {

  return (
    <WagmiProvider config={testWagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
