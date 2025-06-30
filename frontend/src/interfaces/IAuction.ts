export interface IAuction {
  id: string;
  name: string;
  basePrice: number;
  auctionDuration: number;
  description: string;
  img?: string;
  startTime: string;
  endTime: string;
  type: string; 
}
