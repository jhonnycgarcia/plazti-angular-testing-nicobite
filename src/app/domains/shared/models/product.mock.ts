import { faker } from '@faker-js/faker';
import { Product } from '@shared/models/product.model';
import { generateFakeCategory } from './category.mock';

export const generateFakeProduct = (data: Partial<Product> = {}): Product => {
  return {
    id: faker.number.int(),
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    images: [faker.image.url(), faker.image.url()],
    creationAt: faker.date.past().toISOString(),
    category: generateFakeCategory(data?.category),
    slug: faker.lorem.slug(),
    ...data,
  };
};
