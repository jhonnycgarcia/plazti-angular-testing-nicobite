import {
  SpectatorRouting,
  byTestId,
  createRoutingFactory,
} from '@ngneat/spectator/jest';
import { ProductComponent } from './product.component';
import { generateFakeProduct } from '@shared/models/product.mock';
import { Product } from '@shared/models/product.model';

describe('ProductComponent', () => {
  let spectator: SpectatorRouting<ProductComponent>;
  const mockProduct: Product = generateFakeProduct();
  const createComponent = createRoutingFactory({
    component: ProductComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });

    spectator.setInput('product', mockProduct);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display product title', () => {
    const element = spectator.query(byTestId('product-title'));
    expect(element).toHaveText(mockProduct.title);
  });
});
