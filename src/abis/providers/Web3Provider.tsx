import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { PropsWithChildren } from 'react';

const config = createConfig(
  getDefaultConfig({
    chains: [arbitrum],
    transports: {
      [arbitrum.id]: http()
    },
    walletConnectProjectId: "c1b1b3b7-3b1b-4b1b-8b1b-0b1b1b1b1b1b",
    appName: "Wagmi demo",
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};