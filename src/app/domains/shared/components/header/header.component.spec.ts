import {
  SpectatorRouting,
  byTestId,
  createRoutingFactory,
} from '@ngneat/spectator/jest';
import { HeaderComponent } from './header.component';
import { CartService } from '@shared/services/cart.service';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('HeaderComponent', () => {
  let spectator: SpectatorRouting<HeaderComponent>;
  let cartService: CartService;

  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    providers: [CartService],
    shallow: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    cartService = spectator.inject(CartService);
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have initial state', () => {
      expect(spectator.component.hideSideMenu()).toBe(true);
      expect(spectator.component.showMenu()).toBe(false);
    });
  });

  describe('Menu Toggle Functionality', () => {
    it('should toggle mobile menu when toggleMenu is called', () => {
      expect(spectator.component.showMenu()).toBe(false);

      spectator.component.toggleMenu();
      expect(spectator.component.showMenu()).toBe(true);

      spectator.component.toggleMenu();
      expect(spectator.component.showMenu()).toBe(false);
    });

    it('should show mobile menu button on mobile view', () => {
      const menuButton = spectator.query(byTestId('menu-button'));
      expect(menuButton).toBeTruthy();
    });

    it('should have correct menu button attributes', () => {
      const menuButton = spectator.query(byTestId('menu-button'));
      expect(menuButton).toHaveAttribute('aria-controls', 'navbar-default');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should toggle mobile menu visibility', () => {
      const mobileMenu = spectator.query(byTestId('mobile-menu'));
      expect(mobileMenu).toHaveClass('hidden');

      spectator.component.toggleMenu();
      spectator.detectChanges();

      expect(mobileMenu).not.toHaveClass('hidden');
    });
  });

  describe('Side Menu Toggle Functionality', () => {
    it('should toggle side menu when toogleSideMenu is called', () => {
      expect(spectator.component.hideSideMenu()).toBe(true);

      spectator.component.toogleSideMenu();
      expect(spectator.component.hideSideMenu()).toBe(false);

      spectator.component.toogleSideMenu();
      expect(spectator.component.hideSideMenu()).toBe(true);
    });

    it('should have side menu toggle button', () => {
      const sideMenuButton = spectator.query(byTestId('cart-button'));
      expect(sideMenuButton).toBeTruthy();
    });

    it('should toggle side menu visibility', () => {
      const sideMenu = spectator.query(byTestId('side-menu'));
      expect(sideMenu).toHaveClass('translate-x-full');

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      expect(sideMenu).not.toHaveClass('translate-x-full');
    });
  });

  describe('Cart Display', () => {
    it('should display cart count badge', () => {
      const cartBadge = spectator.query(byTestId('cart-count'));
      expect(cartBadge).toBeTruthy();
    });

    it('should display correct cart count', () => {
      const mockProducts = [generateFakeProduct(), generateFakeProduct()];
      cartService.cart.set(mockProducts);

      spectator.detectChanges();

      const cartBadge = spectator.query(byTestId('cart-count'));
      expect(cartBadge).toHaveText('2');
    });

    it('should display zero when cart is empty', () => {
      cartService.cart.set([]);

      spectator.detectChanges();

      const cartBadge = spectator.query(byTestId('cart-count'));
      expect(cartBadge).toHaveText('0');
    });

    it('should display cart total in side menu', () => {
      const mockProducts = [
        generateFakeProduct({ price: 10 }),
        generateFakeProduct({ price: 20 }),
      ];
      cartService.cart.set(mockProducts);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const totalElement = spectator.query(byTestId('cart-total'));
      expect(totalElement).toHaveText('Total: 30');
    });

    it('should display cart items in side menu', () => {
      const mockProducts = [
        generateFakeProduct({ title: 'Product 1', price: 10 }),
        generateFakeProduct({ title: 'Product 2', price: 20 }),
      ];
      cartService.cart.set(mockProducts);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const productTitles = spectator.queryAll(byTestId('product-title'));
      expect(productTitles).toHaveLength(2);
      expect(productTitles[0]).toHaveText('Product 1');
      expect(productTitles[1]).toHaveText('Product 2');
    });

    it('should display product prices in cart', () => {
      const mockProducts = [
        generateFakeProduct({ title: 'Product 1', price: 10 }),
        generateFakeProduct({ title: 'Product 2', price: 20 }),
      ];
      cartService.cart.set(mockProducts);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const productPrices = spectator.queryAll(byTestId('product-price'));
      expect(productPrices).toHaveLength(2);
      expect(productPrices[0]).toHaveText('10');
      expect(productPrices[1]).toHaveText('20');
    });
  });

  describe('Navigation Links', () => {
    it('should have all required navigation links', () => {
      const homeLink = spectator.query(byTestId('nav-home'));
      const aboutLink = spectator.query(byTestId('nav-about'));
      const locationsLink = spectator.query(byTestId('nav-locations'));
      const servicesLink = spectator.query(byTestId('nav-services'));

      expect(homeLink).toBeTruthy();
      expect(aboutLink).toBeTruthy();
      expect(locationsLink).toBeTruthy();
      expect(servicesLink).toBeTruthy();
    });

    it('should have correct router links', () => {
      const homeLink = spectator.query(byTestId('nav-home'));
      const aboutLink = spectator.query(byTestId('nav-about'));
      const locationsLink = spectator.query(byTestId('nav-locations'));
      const servicesLink = spectator.query(byTestId('nav-services'));

      expect(homeLink).toHaveAttribute('routerLink', '/');
      expect(aboutLink).toHaveAttribute('routerLink', '/about');
      expect(locationsLink).toHaveAttribute('routerLink', '/locations');
      expect(servicesLink).toHaveAttribute('routerLink', '/services');
    });

    it('should have router link active directives', () => {
      const links = spectator.queryAll('[routerLinkActive]');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Logo and Brand', () => {
    it('should display logo image', () => {
      const logo = spectator.query(byTestId('logo-image'));
      expect(logo).toBeTruthy();
      expect(logo).toHaveAttribute('alt', 'NgStore');
      expect(logo).toHaveAttribute('src', '/assets/logo.png');
    });

    it('should display brand name', () => {
      const brandName = spectator.query(byTestId('brand-name'));
      expect(brandName).toHaveText('NgStore');
    });

    it('should have logo link to home', () => {
      const logoLink = spectator.query(byTestId('logo-link'));
      expect(logoLink).toBeTruthy();
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Search Component', () => {
    it('should include search component', () => {
      const searchComponent = spectator.query(byTestId('search-component'));
      expect(searchComponent).toBeTruthy();
    });
  });

  describe('Side Menu Content', () => {
    it('should display "My Cart" title in side menu', () => {
      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const title = spectator.query(byTestId('cart-title'));
      expect(title).toHaveText('My Cart');
    });

    it('should have close button in side menu', () => {
      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const closeButton = spectator.query(byTestId('close-cart-button'));
      expect(closeButton).toBeTruthy();
    });

    it('should display product images in cart', () => {
      const mockProduct = generateFakeProduct({
        title: 'Test Product',
        images: ['test-image.jpg'],
      });
      cartService.cart.set([mockProduct]);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const productImage = spectator.query(byTestId('product-image'));
      expect(productImage).toBeTruthy();
      expect(productImage).toHaveAttribute('src', 'test-image.jpg');
      expect(productImage).toHaveAttribute('alt', 'Test Product');
    });

    it('should handle products without images', () => {
      const mockProduct = generateFakeProduct({
        title: 'Test Product',
        images: [],
      });
      cartService.cart.set([mockProduct]);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const productImage = spectator.query(byTestId('product-image'));
      expect(productImage).toHaveAttribute('src', '');
    });

    it('should display correct number of cart items', () => {
      const mockProducts = [
        generateFakeProduct({ title: 'Product 1' }),
        generateFakeProduct({ title: 'Product 2' }),
        generateFakeProduct({ title: 'Product 3' }),
      ];
      cartService.cart.set(mockProducts);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const cartItems = spectator.queryAll(byTestId('cart-item'));
      expect(cartItems).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large cart count', () => {
      const manyProducts = Array.from({ length: 999 }, () =>
        generateFakeProduct()
      );
      cartService.cart.set(manyProducts);

      spectator.detectChanges();

      const cartBadge = spectator.query(byTestId('cart-count'));
      expect(cartBadge).toHaveText('999');
    });

    it('should handle products with very long titles', () => {
      const longTitle = 'A'.repeat(100);
      const mockProduct = generateFakeProduct({ title: longTitle });
      cartService.cart.set([mockProduct]);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const productTitle = spectator.query(byTestId('product-title'));
      expect(productTitle).toHaveText(longTitle);
    });

    it('should handle products with decimal prices', () => {
      const mockProduct = generateFakeProduct({ price: 10.99 });
      cartService.cart.set([mockProduct]);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const totalElement = spectator.query(byTestId('cart-total'));
      expect(totalElement).toHaveText('Total: 10.99');
    });

    it('should handle products with zero price', () => {
      const mockProduct = generateFakeProduct({ price: 0 });
      cartService.cart.set([mockProduct]);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const totalElement = spectator.query(byTestId('cart-total'));
      expect(totalElement).toHaveText('Total: 0');
    });

    it('should handle empty cart in side menu', () => {
      cartService.cart.set([]);

      spectator.component.toogleSideMenu();
      spectator.detectChanges();

      const cartItems = spectator.queryAll(byTestId('cart-item'));
      expect(cartItems).toHaveLength(0);

      const totalElement = spectator.query(byTestId('cart-total'));
      expect(totalElement).toHaveText('Total: 0');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const menuButton = spectator.query(byTestId('menu-button'));
      expect(menuButton).toHaveAttribute('aria-controls', 'navbar-default');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have screen reader text', () => {
      const srText = spectator.query('.sr-only');
      expect(srText).toHaveText('Open main menu');
    });

    it('should have proper alt text for images', () => {
      const logo = spectator.query(byTestId('logo-image'));
      expect(logo).toHaveAttribute('alt', 'NgStore');
    });
  });

  describe('User Interactions', () => {
    it('should toggle menu when menu button is clicked', () => {
      const menuButton = spectator.query(byTestId('menu-button'))!;

      spectator.click(menuButton);
      expect(spectator.component.showMenu()).toBe(true);

      spectator.click(menuButton);
      expect(spectator.component.showMenu()).toBe(false);
    });

    it('should toggle side menu when cart button is clicked', () => {
      const cartButton = spectator.query(byTestId('cart-button'))!;

      spectator.click(cartButton);
      expect(spectator.component.hideSideMenu()).toBe(false);

      spectator.click(cartButton);
      expect(spectator.component.hideSideMenu()).toBe(true);
    });

    it('should close side menu when close button is clicked', () => {
      spectator.component.toogleSideMenu();
      expect(spectator.component.hideSideMenu()).toBe(false);

      const closeButton = spectator.query(byTestId('close-cart-button'))!;
      spectator.click(closeButton);

      expect(spectator.component.hideSideMenu()).toBe(true);
    });
  });
});
