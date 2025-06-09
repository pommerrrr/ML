export interface MLProduct {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  permalink: string;
  category_id: string;
  sold_quantity: number;
  condition: string;
  shipping: {
    free_shipping: boolean;
    cost?: number;
  };
  attributes: Array<{
    id: string;
    name: string;
    value_name: string;
  }>;
}

export interface ProductAnalysis {
  id: string;
  product: MLProduct;
  analysis: {
    sellingPrice: number;
    mlFees: number;
    shippingCost: number;
    premiumAdCost: number;
    totalCosts: number;
    netRevenue: number;
    suggestedMaxCost: number;
    profitMargin: number;
    targetProfitMargin: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MLSearchResponse {
  site_id: string;
  query: string;
  results: MLProduct[];
  paging: {
    total: number;
    offset: number;
    limit: number;
    primary_results: number;
  };
}

export interface CostCalculation {
  sellingPrice: number;
  mlFeePercentage: number; // Taxa do ML (geralmente 5-18%)
  shippingCost: number;
  premiumAdCost: number;
  targetProfitMargin: number; // 30% default
}