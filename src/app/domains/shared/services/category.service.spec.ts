import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';
import { enableFetchMocks } from 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';
import { CategoryService } from './category.service';
import { environment } from '@env/environment';
import { generateFakeCategory } from '../models/category.mock';

enableFetchMocks();

describe('CategoryService', () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createHttp = createHttpFactory(CategoryService);

  beforeEach(() => {
    spectator = createHttp();
    fetchMock.resetMocks();
  });

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

      fetchMock.mockResponse(JSON.stringify(mockCategories));

      const result = await spectator.service.getAllPromise();

      expect(result).toEqual(mockCategories);
      expect(fetchMock).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response from fetch API', async () => {
      fetchMock.mockResponse(JSON.stringify([]));

      const result = await spectator.service.getAllPromise();

      expect(result).toEqual([]);
      expect(fetchMock).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch API error', async () => {
      const errorMessage = 'Network error';
      fetchMock.mockReject(new Error(errorMessage));

      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        errorMessage
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should handle HTTP error response from fetch API', async () => {
      const errorData = { error: 'Not Found' };
      fetchMock.mockResponse(JSON.stringify(errorData), {
        status: 404,
        statusText: 'Not Found',
      });

      const result = await spectator.service.getAllPromise();

      expect(result).toEqual(errorData);
      expect(fetchMock).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed JSON response', async () => {
      fetchMock.mockResponse('invalid json', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });

      await expect(spectator.service.getAllPromise()).rejects.toThrow();
      expect(fetchMock).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
