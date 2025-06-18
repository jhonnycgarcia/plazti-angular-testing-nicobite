import { faker } from '@faker-js/faker';
import { Category } from '@shared/models/category.model';

export const generateFakeCategory = (
  data: Partial<Category> = {}
): Category => {
  return {
    id: faker.number.int(),
    name: faker.commerce.productName(),
    image: faker.image.url(),
    slug: faker.lorem.slug(),
    ...data,
  };
};
