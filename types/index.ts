export interface MercadoLivreProduct {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  available_quantity: number;
  sold_quantity: number;
  condition: string;
  listing_type_id: string;
  permalink: string;
  thumbnail: string;
  shipping: {
    free_shipping: boolean;
    mode: string;
    tags: string[];
  };
  seller: {
    id: number;
    nickname: string;
    car_dealer: boolean;
    real_estate_agency: boolean;
    tags: string[];
  };
  category_id: string;
  domain_id: string;
  catalog_product_id?: string;
  product_name?: string;
}

export interface ProductAnalysis {
  id: string;
  productId: string;
  title: string;
  currentPrice: number;
  soldQuantity: number;
  catalogPrice?: number;
  shippingCost: number;
  marketplaceFee: number;
  advertisingCost: number;
  totalCosts: number;
  netReceived: number;
  recommendedCostPrice: number;
  profitMargin: number;
  lastUpdated: Date;
  isWinning: boolean;
  competition: {
    totalListings: number;
    averagePrice: number;
    lowestPrice: number;
  };
}

export interface TrendProduct {
  keyword: string;
  url: string;
  categoryId: string;
  categoryName: string;
}

export interface AnalysisSettings {
  targetProfitMargin: number;
  shippingCostPercentage: number;
  marketplaceFeePercentage: number;
  advertisingCostPercentage: number;
  additionalCosts: number;
}

export interface DashboardStats {
  totalProducts: number;
  averageProfitMargin: number;
  totalRevenue: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    averagePrice: number;
  }>;
}