// Normalized product shape used throughout the app
export interface ShopifyProduct {
  id: string;
  variantId: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  imageAlt: string | null;
  availableForSale: boolean;
  tags: string[];
  careLevel: string | null;
}

// Cart types
export interface ShopifyCartLine {
  merchandiseId: string; // variant GID
  quantity: number;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
}

// Raw Storefront API response types
export interface StorefrontProductEdge {
  node: {
    id: string;
    handle: string;
    title: string;
    description: string;
    vendor: string;
    productType: string;
    tags: string[];
    availableForSale: boolean;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
    variants: {
      edges: Array<{
        node: {
          id: string;
        };
      }>;
    };
    metafields: Array<{
      key: string;
      value: string;
    } | null>;
  };
}

export interface StorefrontProductsResponse {
  data: {
    products: {
      edges: StorefrontProductEdge[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

export interface StorefrontCartCreateResponse {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
}
