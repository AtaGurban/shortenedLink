import { Router } from "express"
import shortenedLinkRouter from "./shortenedLinkRouter.ts"


const router = Router()

router.use('/', shortenedLinkRouter) 


export default router