export interface Collectible {
  contractAddress: string;
  deployedAt: string;
  startingTokenId: number;
  productId: string;
  name: string;
  description: string;
  supply: number;
  previewUrl: string;
  backgroundUrl: string;
  status: string;
  creator: string;
  sold: number;
  price: 249 | 499 | 999 | 2499 | 4999 | 7499 | 9999 | 19999;
  traits: string[];
  tags: string[];
}

export interface Creator {
  username: string;
  displayName: string;
  description: string;
  profileUrl: string;
  genAi: boolean;
}
