import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';
import { ProductService } from './product.service';
import { environment } from '@env/environment';
import { generateFakeProduct } from '../models/product.mock';

describe('ProductService', () => {
  let spectator: SpectatorHttp<ProductService>;
  const createHttp = createHttpFactory(ProductService);

  beforeEach(() => (spectator = createHttp()));

  describe('getProducts', () => {
    it('should fetch products without filters', () => {
      const mockProducts = [generateFakeProduct(), generateFakeProduct()];
      const url = `${environment.apiUrl}/api/v1/products`;

      spectator.service.getProducts().subscribe(response => {
        expect(response).toEqual(mockProducts);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should fetch products with category_id filter', () => {
      const mockProducts = [generateFakeProduct()];
      const categoryId = '123';
      const url = `${environment.apiUrl}/api/v1/products?categoryId=${categoryId}`;

      spectator.service
        .getProducts({ category_id: categoryId })
        .subscribe(response => {
          expect(response).toEqual(mockProducts);
        });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should fetch products with category_slug filter', () => {
      const mockProducts = [generateFakeProduct()];
      const categorySlug = 'electronics';
      const url = `${environment.apiUrl}/api/v1/products?categorySlug=${categorySlug}`;

      spectator.service
        .getProducts({ category_slug: categorySlug })
        .subscribe(response => {
          expect(response).toEqual(mockProducts);
        });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should fetch products with both filters', () => {
      const mockProducts = [generateFakeProduct()];
      const categoryId = '123';
      const categorySlug = 'electronics';
      const url = `${environment.apiUrl}/api/v1/products?categoryId=${categoryId}&categorySlug=${categorySlug}`;

      spectator.service
        .getProducts({
          category_id: categoryId,
          category_slug: categorySlug,
        })
        .subscribe(response => {
          expect(response).toEqual(mockProducts);
        });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should handle empty response', () => {
      const url = `${environment.apiUrl}/api/v1/products`;

      spectator.service.getProducts({}).subscribe(response => {
        expect(response).toEqual([]);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush([]);
    });

    it('should handle HTTP error', () => {
      const url = `${environment.apiUrl}/api/v1/products`;
      const errorResponse = { status: 404, statusText: 'Not Found' };

      spectator.service.getProducts({}).subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.message).toBe('Not Found');
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, errorResponse);
    });
  });

  describe('getOne', () => {
    it('should fetch a single product by id', () => {
      const mockProduct = generateFakeProduct();
      const id = '1';
      const url = `${environment.apiUrl}/api/v1/products/${id}`;

      spectator.service.getOne(id).subscribe(response => {
        expect(response).toEqual(mockProduct);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProduct);
    });

    it('should handle product not found', () => {
      const id = '999';
      const url = `${environment.apiUrl}/api/v1/products/${id}`;
      const errorResponse = { status: 404, statusText: 'Not Found' };

      spectator.service.getOne(id).subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.message).toBe('Not Found');
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, errorResponse);
    });
  });

  describe('getOneBySlug', () => {
    it('should fetch a single product by slug', () => {
      const mockProduct = generateFakeProduct();
      const slug = 'test-product';
      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}`;

      spectator.service.getOneBySlug(slug).subscribe(response => {
        expect(response).toEqual(mockProduct);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProduct);
    });

    it('should handle product not found by slug', () => {
      const slug = 'non-existent-product';
      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}`;
      const errorResponse = { status: 404, statusText: 'Not Found' };

      spectator.service.getOneBySlug(slug).subscribe({
        error: error => {
          expect(error.status).toBe(404);
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, errorResponse);
    });
  });

  describe('getRelatedProducts', () => {
    it('should fetch related products', () => {
      const mockProducts = [generateFakeProduct(), generateFakeProduct()];
      const slug = 'test-product';
      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}/related`;

      spectator.service.getRelatedProducts(slug).subscribe(response => {
        expect(response).toEqual(mockProducts);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should handle empty related products', () => {
      const slug = 'test-product';
      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}/related`;

      spectator.service.getRelatedProducts(slug).subscribe(response => {
        expect(response).toEqual([]);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush([]);
    });

    it('should handle error fetching related products', () => {
      const slug = 'test-product';
      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}/related`;
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };

      spectator.service.getRelatedProducts(slug).subscribe({
        error: error => {
          expect(error.status).toBe(500);
          expect(error.message).toBe('Internal Server Error');
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, errorResponse);
    });
  });
});
