import { $host } from ".";
import { GetShortenedLinksParams } from "../types/bodies/ShortenedLink/ShortenedLink";
import { LinkRow, LinksResponse } from "../types/database/LinkRow";
import { buildQueryParams } from "../utils/func";

export const createShortenedLink = async (item: FormData) => {
  const { data } = await $host.post("shorten", item);
  return data;
};

export const getShortenedLinks = async (params: GetShortenedLinksParams): Promise<LinksResponse> => {
  const queryParams = buildQueryParams(params);
  const { data } = await $host.get(`list?${queryParams}`);
  return data;
};

export const getShortenedLinkInfo = async (param: string): Promise<LinkRow & {clickCount: number}> => {
  const { data } = await $host.get(`info/${param}`);
  return data;
};

export const getShortenedLinkAnalytic = async (param: string): Promise<LinkRow & {clickCount: number}> => {
  const { data } = await $host.get(`analytics/${param}`);
  return data;
};

export const deleteShortenedLink = async (param: string) => {
  const { data } = await $host.delete(`delete/${param}`);
  return data;
};


