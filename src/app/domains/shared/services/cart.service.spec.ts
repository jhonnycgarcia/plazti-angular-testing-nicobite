import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { CartService } from './cart.service';
import { Product } from '@shared/models/product.model';

describe('CartService', () => {
  let spectator: SpectatorService<CartService>;
  const createService = createServiceFactory(CartService);

  const mockProduct: Product = {
    id: 1,
    title: 'Product 1',
    description: 'Product 1',
    price: 10,
    images: [],
    creationAt: new Date().toISOString(),
    category: {
      id: 1,
      name: 'Category 1',
      image: 'https://via.placeholder.com/150',
      slug: 'category-1',
    },
    slug: 'product-1',
  };

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
    expect(spectator.service).toBeDefined();
  });

  it('should initialize with an empty cart', () => {
    expect(spectator.service.cart()).toEqual([]);
    expect(spectator.service.total()).toBe(0);
  });

  it('should add a product to the cart', () => {
    spectator.service.addToCart(mockProduct);
    expect(spectator.service.cart()).toEqual([mockProduct]);
    expect(spectator.service.total()).toBe(mockProduct.price);
  });

  it('should handle multiple products in cart', () => {
    const mockProduct2: Product = {
      ...mockProduct,
      id: 2,
      title: 'Product 2',
      price: 20,
    };

    spectator.service.addToCart(mockProduct);
    spectator.service.addToCart(mockProduct2);

    expect(spectator.service.cart()).toEqual([mockProduct, mockProduct2]);
    expect(spectator.service.total()).toBe(30); // 10 + 20
  });

  it('should handle products with zero price', () => {
    const freeProduct: Product = {
      ...mockProduct,
      id: 3,
      title: 'Free Product',
      price: 0,
    };

    spectator.service.addToCart(freeProduct);
    expect(spectator.service.cart()).toEqual([freeProduct]);
    expect(spectator.service.total()).toBe(0);
  });

  it('should handle products with negative price', () => {
    const discountedProduct: Product = {
      ...mockProduct,
      id: 4,
      title: 'Discounted Product',
      price: -5,
    };

    spectator.service.addToCart(discountedProduct);
    expect(spectator.service.cart()).toEqual([discountedProduct]);
    expect(spectator.service.total()).toBe(-5);
  });

  it('should handle products with decimal prices', () => {
    const decimalProduct: Product = {
      ...mockProduct,
      id: 5,
      title: 'Decimal Product',
      price: 10.99,
    };

    spectator.service.addToCart(decimalProduct);
    expect(spectator.service.cart()).toEqual([decimalProduct]);
    expect(spectator.service.total()).toBe(10.99);
  });

  it('should handle multiple products with mixed prices', () => {
    const products: Product[] = [
      { ...mockProduct, id: 1, price: 10 },
      { ...mockProduct, id: 2, price: 0 },
      { ...mockProduct, id: 3, price: -5 },
      { ...mockProduct, id: 4, price: 10.99 },
    ];

    products.forEach(product => spectator.service.addToCart(product));

    expect(spectator.service.cart()).toEqual(products);
    expect(spectator.service.total()).toBe(15.99); // 10 + 0 + (-5) + 10.99
  });

  it('should maintain cart state after multiple operations', () => {
    // Add first product
    spectator.service.addToCart(mockProduct);
    expect(spectator.service.cart().length).toBe(1);
    expect(spectator.service.total()).toBe(10);

    // Add second product
    const mockProduct2 = { ...mockProduct, id: 2, price: 20 };
    spectator.service.addToCart(mockProduct2);
    expect(spectator.service.cart().length).toBe(2);
    expect(spectator.service.total()).toBe(30);

    // Add third product
    const mockProduct3 = { ...mockProduct, id: 3, price: 30 };
    spectator.service.addToCart(mockProduct3);
    expect(spectator.service.cart().length).toBe(3);
    expect(spectator.service.total()).toBe(60);
  });
});
