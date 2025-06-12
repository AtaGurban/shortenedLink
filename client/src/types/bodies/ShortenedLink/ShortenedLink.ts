export interface CreateShortenedLinkBody {
  originalUrl: string;
  expiresAt: string;
  alias?: string;
}

export interface GetShortenedLinksParams {
  page: number;
  limit: number;
  [key: string]: string | number | Date | undefined;
}
