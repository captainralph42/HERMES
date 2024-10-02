import React, { useEffect, useState } from "react";
import { HermesCollectionNFTInstance } from "artifacts/ts";
import { web3, NodeProvider } from '@alephium/web3';

const TotalSupply: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    const fetchTotalSupply = async () => {
      try {
        const nodeProvider = new NodeProvider(process.env.NEXT_PUBLIC_NODE_PROVIDER!);
        web3.setCurrentNodeProvider(nodeProvider);

        const contractAddress = process.env.NEXT_PUBLIC_COLLECTION_ID!;
        const contractInstance = new HermesCollectionNFTInstance(contractAddress);
        const result = await contractInstance.view.totalSupply();

        setTotalSupply(result.returns.toString());
      } catch (err) {
        setTotalSupply("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalSupply();
  }, []);

  if (!isClient) return null;

  if (loading) {
    return <span>Loading...</span>;
  }

  return <span>{totalSupply}</span>;
};

export default TotalSupply;
