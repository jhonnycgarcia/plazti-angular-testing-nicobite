import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MetaTagsService, PageMetaData } from './meta-tags.service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

describe('MetaTagsService', () => {
  let spectator: SpectatorService<MetaTagsService>;
  let metaPlatform: Meta;
  let titlePlatform: Title;

  const createService = createServiceFactory({
    service: MetaTagsService,
    providers: [
      {
        provide: Title,
        useValue: {
          setTitle: jest.fn(),
        },
      },
      {
        provide: Meta,
        useValue: {
          updateTag: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    metaPlatform = spectator.inject(Meta);
    titlePlatform = spectator.inject(Title);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
    expect(spectator.service).toBeDefined();
  });

  it('should update all meta tags with complete data', () => {
    const mockMetaData = {
      title: 'Test Title',
      description: 'Test Description',
      image: 'Test Image',
      url: 'Test URL',
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(mockMetaData.title);
    expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: mockMetaData.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: mockMetaData.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:title',
      content: mockMetaData.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:description',
      content: mockMetaData.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: mockMetaData.image,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: mockMetaData.url,
    });
  });

  it('should use default values for missing meta data', () => {
    const mockMetaData = {
      title: 'Test Title',
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(mockMetaData.title);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });

  it('should handle empty meta data object', () => {
    spectator.service.updateMetaTags({});

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('Ng Store');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });

  it('should handle meta data with empty strings', () => {
    const mockMetaData = {
      title: '',
      description: '',
      image: '',
      url: '',
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: '',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: '',
    });
  });

  it('should handle meta data with special characters', () => {
    const mockMetaData = {
      title: 'Test Title & Special Characters',
      description: 'Description with "quotes" and <tags>',
      image: 'https://example.com/image.jpg?param=value',
      url: 'https://example.com/page?param=value&other=123',
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(mockMetaData.title);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: mockMetaData.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: mockMetaData.url,
    });
  });

  it('should handle meta data with very long content', () => {
    const longString = 'a'.repeat(1000);
    const mockMetaData = {
      title: longString,
      description: longString,
      image: longString,
      url: longString,
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(longString);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: longString,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: longString,
    });
  });

  it('should handle meta data with null values', () => {
    const mockMetaData: Partial<PageMetaData> = {
      title: null as unknown as string,
      description: null as unknown as string,
      image: null as unknown as string,
      url: null as unknown as string,
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('Ng Store');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });

  it('should handle meta data with undefined values', () => {
    const mockMetaData: Partial<PageMetaData> = {
      title: undefined,
      description: undefined,
      image: undefined,
      url: undefined,
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('Ng Store');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });

  it('should handle mixed undefined and defined values', () => {
    const mockMetaData: Partial<PageMetaData> = {
      title: 'Custom Title',
      description: undefined,
      image: 'https://example.com/image.jpg',
      url: undefined,
    };

    spectator.service.updateMetaTags(mockMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('Custom Title');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: 'https://example.com/image.jpg',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });
});
