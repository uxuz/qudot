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
  featuredWeight: number;
}

export type CollectiblePreview = Pick<
  Collectible,
  | "name"
  | "productId"
  | "deployedAt"
  | "creator"
  | "sold"
  | "price"
  | "supply"
  | "previewUrl"
>;

export interface Creator {
  username: string;
  displayName: string;
  description: string;
  profileUrl: string;
  genAi: boolean;
}

export type CreatorStats = Record<
  string,
  { collectiblesCount: number; revenue: number }
>;
