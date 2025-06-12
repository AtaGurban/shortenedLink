import {
  ShortenedLink,
  ShortenedLinkClick,
} from "../../models/ShortenedLinkModels.ts";
import redisClient, { redisTime } from "../../service/redis/redis.ts";
import {
  CreateShortenedLinkBody,
  GetShortenedLinks,
} from "../../service/zod/shortenedLink.ts";
import errorHandler from "../../utils/erronHandler.ts";
import { Includeable } from "sequelize";

class ShortenedLinkDao {
  async getShortenedLinkForRedirect(alias: string) {
    try {
      const cachedData = await redisClient.get(`shortenedLink-${alias}`);
      if (cachedData) {
        const data = JSON.parse(cachedData) as ShortenedLink;
        return {
          success: true,
          message: "",
          data,
        };
      }
      const data = await ShortenedLink.findOne({
        raw: true,
        where: { alias },
        attributes: ["id", "alias", "originalUrl", "expiresAt"],
      });
      if (!data) {
        return { success: false, message: "Ссылка не найдена" };
      }
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        return { success: false, message: "Срок действия ссылки истёк" };
      }
      redisClient.setEx(
        `shortenedLink-${alias}`,
        redisTime,
        JSON.stringify(data)
      );
      return { success: true, data, message: "" };
    } catch (error) {
      return errorHandler(error);
    }
  }
  async deleteShortenedLink(alias: string) {
    try {
      const deletedCount = await ShortenedLink.destroy({
        where: { alias },
      });
      if (deletedCount === 0) {
        return { success: false, message: "Ссылка не найдена" };
      }
      return { success: true, message: "" };
    } catch (error) {
      return errorHandler(error);
    }
  }
  async getShortenedLinkInfo(alias: string, forAnalytic?: boolean) {
    try {
      const includeModels: Includeable[] = [];
      if (forAnalytic) {
        includeModels.push({
          model: ShortenedLinkClick,
          as: "clicks",
          limit: 5,
          attributes: ["id", "ip", "createdAt"],
        });
      }
      const shortenedLink = await ShortenedLink.findOne({
        where: { alias },
        include: includeModels,
        attributes: ["id", "alias", "originalUrl", "createdAt"],
      }).then((data) => data && data.get({ plain: true }));
      if (!shortenedLink) {
        return { success: false, message: "Ссылка не найдена" };
      }
      const clickCount = await ShortenedLinkClick.count({
        where: { linkId: shortenedLink.id },
      });
      return {
        success: true,
        data: { ...shortenedLink, clickCount },
        message: "",
      };
    } catch (error) {
      return errorHandler(error);
    }
  }
  async getShortenedLinks(params: GetShortenedLinks) {
    try {
      const { limit, page } = params;
      const offset = (page - 1) * limit;
      const data = await ShortenedLink.findAndCountAll({
        raw: true,
        limit,
        offset,
      });
      return { success: true, data, message: "" };
    } catch (error) {
      return errorHandler(error);
    }
  }
  async createShortenedLink(data: CreateShortenedLinkBody) {
    try {
      const { originalUrl, expiresAt, alias } = data;
      const { nanoid } = await import("nanoid");
      if (alias){
        const checkOld = await ShortenedLink.findOne({where: {alias}, attributes: ["id"], raw: true})
        if (checkOld){
          return {success: false, message: "Этот алиас уже занят"}
        }
      }
      const currentAlias = alias ?? nanoid(8);
      const dataForSave: Partial<ShortenedLink> = {
        originalUrl,
        alias: currentAlias,
      };
      if (expiresAt) {
        dataForSave.expiresAt = new Date(expiresAt);
      }
      await ShortenedLink.create(dataForSave);
      return { success: true, message: "", data: currentAlias };
    } catch (error) {
      return errorHandler(error);
    }
  }
}

const shortenedLinkDao = new ShortenedLinkDao();
export default shortenedLinkDao;
