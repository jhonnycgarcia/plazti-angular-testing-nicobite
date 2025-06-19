import ProductDetailComponent from './product-detail.component';
import { ProductService } from '@shared/services/product.service';
import {
  SpectatorRouting,
  SpyObject,
  byTestId,
  createRoutingFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { generateFakeProduct } from '@shared/models/product.mock';
import { of } from 'rxjs';

describe('ProductDetailComponent', () => {
  let spectator: SpectatorRouting<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;
  const mockProduct = generateFakeProduct();

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    providers: [
      mockProvider(ProductService, {
        getOneBySlug: jest.fn().mockReturnValue(of(mockProduct)),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
      props: {
        slug: mockProduct.slug,
      },
    });

    spectator.setInput('slug', mockProduct.slug);
    productService = spectator.inject(ProductService);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should display product cover', () => {
    // productService.getOneBySlug.mockReturnValue(of(mockProduct));

    spectator.detectChanges();

    const cover = spectator.query<HTMLImageElement>(byTestId('cover'));
    expect(cover).toBeTruthy();
    expect(cover?.src).toContain(mockProduct.images[0]);
  });
});
