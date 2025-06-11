import { NextFunction, Response, Request } from "express";
import ApiError from "../error/ApiError.ts";
import {
  createShortenedLinkSchema,
  getShortenedLinksQuerySchema,
} from "../service/zod/shortenedLink.ts";
import shortenedLinkDao from "../dao/ShortenedLinkDao/ShortenedLinkDao.ts";
import { ShortenedLinkClick } from "../models/ShortenedLinkModels.ts";
import errorHandler from "../utils/erronHandler.ts";

class ShortenedLinkControllers {
  async createShortenedLink(req: Request, res: Response, next: NextFunction) {
    const parsed = createShortenedLinkSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(ApiError.badRequest("Incomplete data"));
    }
    const { success, data, message } =
      await shortenedLinkDao.createShortenedLink(parsed.data);
    if (!success || !data) {
      return next(ApiError.badRequest(message));
    }
    return res.json(data);
  }
  async getShortenedLinks(req: Request, res: Response, next: NextFunction) {
    const parsed = getShortenedLinksQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return next(ApiError.internal("Internal error"));
    }
    const { success, data, message } = await shortenedLinkDao.getShortenedLinks(
      parsed.data
    );
    if (!success || !data) {
      return next(ApiError.badRequest(message));
    }
    return res.json(data);
  }
  async redirectToOriginalUrl(req: Request, res: Response, next: NextFunction) {
    const alias = req.params.shortUrl;
    const { success, data, message } =
      await shortenedLinkDao.getShortenedLinkForRedirect(alias);
    if (!success || !data) {
      return next(ApiError.badRequest(message));
    }
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.socket.remoteAddress;
    setTimeout(async () => {
      try {
        await ShortenedLinkClick.create({ ip, linkId: data.id });
      } catch (error) {
        return errorHandler(error);
      }
    }, 0);
    return res.redirect(data.originalUrl);
  }
  async getShortenedLinkInfo(req: Request, res: Response, next: NextFunction) {
    const alias = req.params.shortUrl;
    const { success, data, message } =
      await shortenedLinkDao.getShortenedLinkInfo(alias);
    if (!success || !data) {
      return next(ApiError.badRequest(message));
    }
    return res.json(data);
  }
  async getShortenedLinkAnalytic(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const alias = req.params.shortUrl;
    const { success, data, message } =
      await shortenedLinkDao.getShortenedLinkInfo(alias, true);
    if (!success || !data) {
      return next(ApiError.badRequest(message));
    }
    return res.json(data);
  }
  async deleteShortenedLink(req: Request, res: Response, next: NextFunction) {
    const alias = req.params.shortUrl;
    const { success, message } = await shortenedLinkDao.deleteShortenedLink(
      alias
    );
    if (!success) {
      return next(ApiError.badRequest(message));
    }
    return res.sendStatus(200);
  }
}

const shortenedLinkControllers = new ShortenedLinkControllers();
export default shortenedLinkControllers;
