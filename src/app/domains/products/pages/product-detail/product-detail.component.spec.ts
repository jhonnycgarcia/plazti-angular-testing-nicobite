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
import { DeferBlockBehavior } from '@angular/core/testing';
import { RelatedComponent } from '@products/components/related/related.component';
import { faker } from '@faker-js/faker/.';

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
    thresholds: [],
    root: null,
    rootMargin: '',
  })),
});

describe('ProductDetailComponent', () => {
  let spectator: SpectatorRouting<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;
  const mockProduct = generateFakeProduct({
    images: Array.from({ length: 4 }, () => faker.image.url()),
  });

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    deferBlockBehavior: DeferBlockBehavior.Manual,
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

  it('should call getOneBySlug when the component is created', () => {
    spectator.detectChanges();
    expect(productService.getOneBySlug).toHaveBeenCalledWith(mockProduct.slug);
  });

  it('should display product cover', () => {
    // productService.getOneBySlug.mockReturnValue(of(mockProduct));
    spectator.detectChanges();
    const cover = spectator.query<HTMLImageElement>(byTestId('cover'));
    expect(cover).toBeTruthy();
    expect(cover?.src).toContain(mockProduct.images[0]);
  });

  it('should load related products', async () => {
    spectator.detectChanges();
    await spectator.deferBlock().renderComplete();
    spectator.detectChanges();

    const relatedProducts = spectator.query(RelatedComponent);
    expect(relatedProducts).toBeTruthy();
  });

  it('should render all images in the gallery', () => {
    spectator.detectChanges();
    const gallery = spectator.query<HTMLDivElement>(byTestId('gallery'));
    const images = gallery?.querySelectorAll<HTMLImageElement>('img');
    expect(images).toHaveLength(mockProduct.images.length);
  });

  it('should change the cover when the user clicks on an image', () => {
    spectator.detectChanges();
    const gallery = spectator.query<HTMLDivElement>(byTestId('gallery'));
    const images = gallery?.querySelectorAll<HTMLImageElement>('img');
    const imageToChange = images![1];

    spectator.click(imageToChange);
    spectator.detectChanges();
    expect(spectator.component.$cover()).toBe(imageToChange.src);
  });
});
