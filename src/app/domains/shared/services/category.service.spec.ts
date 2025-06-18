import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';
import { CategoryService } from './category.service';
import { environment } from '@env/environment';
import { generateFakeCategory } from '../models/category.mock';

describe('CategoryService', () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createHttp = createHttpFactory(CategoryService);

  beforeEach(() => (spectator = createHttp()));

  describe('getAll', () => {
    it('should fetch all categories successfully', () => {
      const mockCategories = [
        generateFakeCategory(),
        generateFakeCategory(),
        generateFakeCategory(),
      ];
      const url = `${environment.apiUrl}/api/v1/categories`;

      spectator.service.getAll().subscribe(response => {
        expect(response).toEqual(mockCategories);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockCategories);
    });

    it('should handle empty categories response', () => {
      const url = `${environment.apiUrl}/api/v1/categories`;

      spectator.service.getAll().subscribe(response => {
        expect(response).toEqual([]);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush([]);
    });

    it('should handle HTTP error when fetching categories', () => {
      const url = `${environment.apiUrl}/api/v1/categories`;
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };

      spectator.service.getAll().subscribe({
        error: error => {
          expect(error.status).toBe(500);
          expect(error.message).toBe('Internal Server Error');
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, errorResponse);
    });

    it('should handle network error', () => {
      const url = `${environment.apiUrl}/api/v1/categories`;
      const errorResponse = {
        status: 0,
        statusText: 'Network Error',
      };

      spectator.service.getAll().subscribe({
        error: error => {
          expect(error.status).toBe(0);
          expect(error.message).toBe('Network Error');
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, errorResponse);
    });

    it('should handle unauthorized error', () => {
      const url = `${environment.apiUrl}/api/v1/categories`;
      const errorResponse = {
        status: 401,
        statusText: 'Unauthorized',
      };

      spectator.service.getAll().subscribe({
        error: error => {
          expect(error.status).toBe(401);
          expect(error.message).toBe('Unauthorized');
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, errorResponse);
    });
  });

  describe('getAllPromise', () => {
    it('should fetch all categories using fetch API successfully', async () => {
      const mockCategories = [generateFakeCategory(), generateFakeCategory()];

      // Mock the global fetch
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCategories),
      });

      const result = await spectator.service.getAllPromise();

      expect(result).toEqual(mockCategories);
      expect(fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });

    it('should handle empty response from fetch API', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue([]),
      });

      const result = await spectator.service.getAllPromise();

      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });

    it('should handle fetch API error', async () => {
      const errorMessage = 'Network error';
      global.fetch = jest.fn().mockRejectedValue(new Error(errorMessage));

      try {
        await spectator.service.getAllPromise();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(errorMessage);
      }
      expect(fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });

    it('should handle HTTP error response from fetch API', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({ error: 'Not Found' }),
      });

      try {
        await spectator.service.getAllPromise();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('HTTP Error: 404 Not Found');
      }

      expect(fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });

    it('should handle malformed JSON response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      try {
        await spectator.service.getAllPromise();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Invalid JSON');
      }
      expect(fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });
  });
});
