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
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should display product title', () => {
    spectator.detectChanges();
    const element = spectator.query(byTestId('product-title'));
    expect(element).toHaveText(mockProduct.title);
  });

  it('should emit product when add to cart button is clicked', () => {
    const addToCartSpy = jest.spyOn(spectator.component.addToCart, 'emit');
    const button = byTestId('add-to-cart-button');

    spectator.detectChanges();
    spectator.click(button);

    expect(addToCartSpy).toHaveBeenCalledWith(mockProduct);
  });
});
