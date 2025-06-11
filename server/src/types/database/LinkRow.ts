import { DatabaseModelRow } from "./DatabaseModelRow";

export interface LinkRow extends DatabaseModelRow{
  originalUrl: string
  alias: string
  expiresAt: Date | null
}

export interface LinkClickRow extends DatabaseModelRow{
  ip: string
  linkId: number
}