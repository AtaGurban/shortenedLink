import { Router } from "express"
import shortenedLinkRouter from "./shortenedLinkRouter"


const router = Router()

router.use('/', shortenedLinkRouter) 


export default router