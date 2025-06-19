import ProductDetailComponent from './product-detail.component';
import { ProductService } from '@shared/services/product.service';
import {
  SpectatorRouting,
  createRoutingFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { generateFakeProduct } from '@shared/models/product.mock';
describe('ProductDetailComponent', () => {
  let spectator: SpectatorRouting<ProductDetailComponent>;
  const mockProduct = generateFakeProduct();

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    providers: [mockProvider(ProductService)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        slug: mockProduct.slug,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
