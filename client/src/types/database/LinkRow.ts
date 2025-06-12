import { DatabaseModelRow } from "./DatabaseModelRow";

export interface LinkRow extends DatabaseModelRow{
  originalUrl: string
  alias: string
  expiresAt: string | null
  clicks?: LinkClickRow[]
  clickCount?: number
}

export interface LinkClickRow extends DatabaseModelRow{
  ip: string
  linkId: number
}

export interface LinksResponse{
  count: number, rows: LinkRow[]
}