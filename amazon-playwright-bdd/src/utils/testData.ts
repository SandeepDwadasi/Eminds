import { faker } from '@faker-js/faker';
import products from '../../test-data/products.json';

export const testData = {
  products,

  /** A search term that should never match a real product. */
  gibberishSearchTerm(): string {
    return `zzqx${faker.string.alphanumeric({ length: 18, casing: 'lower' })}`;
  },
};
