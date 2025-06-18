import { SpectatorRouting, createRoutingFactory } from '@ngneat/spectator/jest';
import { ProductComponent } from './product.component';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('ProductComponent', () => {
  let spectator: SpectatorRouting<ProductComponent>;
  const createComponent = createRoutingFactory({
    component: ProductComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });

    spectator.setInput('product', generateFakeProduct());
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
