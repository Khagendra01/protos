// GIF Service for integrating with real GIF APIs
// This is an example implementation for Giphy API

interface GifResult {
  id: string;
  url: string;
  title: string;
  width: string;
  height: string;
}

interface GiphyResponse {
  data: Array<{
    id: string;
    images: {
      original: {
        url: string;
        width: string;
        height: string;
      };
      fixed_height: {
        url: string;
        width: string;
        height: string;
      };
    };
    title: string;
  }>;
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

class GifService {
  private apiKey: string;
  private baseUrl = 'https://api.giphy.com/v1/gifs';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchGifs(query: string, limit: number = 20, offset: number = 0): Promise<GifResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?api_key=${this.apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GiphyResponse = await response.json();
      
      return data.data.map(gif => ({
        id: gif.id,
        url: gif.images.original.url,
        title: gif.title,
        width: gif.images.original.width,
        height: gif.images.original.height,
      }));
    } catch (error) {
      console.error('Error searching GIFs:', error);
      throw error;
    }
  }

  async getTrendingGifs(limit: number = 20, offset: number = 0): Promise<GifResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/trending?api_key=${this.apiKey}&limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GiphyResponse = await response.json();
      
      return data.data.map(gif => ({
        id: gif.id,
        url: gif.images.original.url,
        title: gif.title,
        width: gif.images.original.width,
        height: gif.images.original.height,
      }));
    } catch (error) {
      console.error('Error getting trending GIFs:', error);
      throw error;
    }
  }

  async getRandomGif(tag?: string): Promise<GifResult | null> {
    try {
      const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : '';
      const response = await fetch(
        `${this.baseUrl}/random?api_key=${this.apiKey}${tagParam}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        id: data.data.id,
        url: data.data.images.original.url,
        title: data.data.title,
        width: data.data.images.original.width,
        height: data.data.images.original.height,
      };
    } catch (error) {
      console.error('Error getting random GIF:', error);
      throw error;
    }
  }
}

// Example usage:
// const gifService = new GifService('YOUR_GIPHY_API_KEY');
// const results = await gifService.searchGifs('funny cat');

export default GifService;
export type { GifResult }; 