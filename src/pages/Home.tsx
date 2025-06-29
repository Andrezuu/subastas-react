import { useEffect } from "react";
import { useAuctionStore } from "../store/useAuctionStore";

function Home() {
  const fetchAuctions = useAuctionStore((state) => state.fetchAuctions);
  const auctions = useAuctionStore((state) => state.auctions);
  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    if (auctions.length > 0) {
      console.log("auctions lodead", auctions);
    }
  }, [auctions]);

  return <div>HOOME</div>;
}
export default Home;
