import { configure } from '@testing-library/react'
import { startProxy } from '@viem/anvil'
import { Chain, polygon } from 'viem/chains'

// waitFor global timeout
// https://testing-library.com/docs/dom-testing-library/api-configuration/#asyncutiltimeout
configure({ asyncUtilTimeout: 10_000 })

type SupportedChain = 'Polygon'

export const ANVIL_NETWORKS = {
  Polygon: {
    networkName: 'Polygon',
    fallBackRpc: 'https://polygon-rpc.com',
    port: 8745,
    // Note - this has to be >= highest blockNo used in tests
    forkBlockNumber: undefined,
  },
} as const

export const polygonTest = {
  ...polygon,
  ...getTestRpcUrls(polygon.name),
} as const satisfies Chain

function getTestRpcUrls(networkName: SupportedChain) {
  const { port, rpcUrl } = getTestRpcSetup(networkName)
  return {
    port,
    rpcUrls: {
      // These rpc urls are automatically used in the transports.
      default: {
        http: [rpcUrl],
      },
      public: {
        http: [rpcUrl],
      },
    },
  } as const
}

function getTestRpcSetup(networkName: SupportedChain) {
  const network = ANVIL_NETWORKS[networkName]
  const port = network.port
  const pool = Number(process.env.VITEST_POOL_ID ?? 1)
  const rpcUrl = `http://127.0.0.1:${port}/${pool}`
  return { port, rpcUrl }
}

export const testChains: Chain[] = [polygonTest]

export function getForkUrl(networkName: SupportedChain): string {
  const privateKey = process.env.VITE_PRIVATE_RPC_KEY
  if (!privateKey) throw new Error('Missing RPC private key')
  return `https://lb.drpc.org/ogrpc?network=${networkName.toLowerCase()}&dkey=${privateKey}`
}

export async function setup() {
  const shutdownCalls: Promise<() => Promise<void>>[] = []
  for (const chain of Object.values(testChains)) {
    console.log('Starting proxy ', {
      port: chain.port,
      forkUrl: getForkUrl(chain.name),
      forkBlockNumber: ANVIL_NETWORKS[chain.name].forkBlockNumber,
    })

    const shutdown = startProxy({
      port: chain.port,
      host: '::',
      options: {
        chainId: chain.id,
        forkUrl: getForkUrl(chain.name),
        forkBlockNumber: ANVIL_NETWORKS[chain.name].forkBlockNumber,
        noMining: false,
      },
    })

    shutdownCalls.push(shutdown)
  }

  return () => {
    return Promise.all(shutdownCalls)
  }
}
