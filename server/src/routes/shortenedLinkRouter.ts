import { Router } from "express";
import tryCatch from "../utils/tryCatch.ts";
import shortenedLinkControllers from "../controllers/ShortenedLinkControllers.ts";


const shortenedLinkRouter = Router();

shortenedLinkRouter.post("/shorten", tryCatch(shortenedLinkControllers.createShortenedLink));
shortenedLinkRouter.get("/list", tryCatch(shortenedLinkControllers.getShortenedLinks));
shortenedLinkRouter.get("/:shortUrl", tryCatch(shortenedLinkControllers.redirectToOriginalUrl));
shortenedLinkRouter.get("/info/:shortUrl", tryCatch(shortenedLinkControllers.getShortenedLinkInfo));
shortenedLinkRouter.get("/analytics/:shortUrl", tryCatch(shortenedLinkControllers.getShortenedLinkAnalytic));
shortenedLinkRouter.delete("/delete/:shortUrl", tryCatch(shortenedLinkControllers.deleteShortenedLink));

export default shortenedLinkRouter;