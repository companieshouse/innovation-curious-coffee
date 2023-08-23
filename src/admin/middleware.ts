import { Request, Response, NextFunction } from "express";
import logger from "../logger";

declare module "express-session" {
    interface SessionData {
        user: boolean;
    }
}

export default function validate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (req.originalUrl.startsWith("/admin/")) {
        logger.info("Validating session for admin routes");

        if (!req.session) {
            logger.info("No session found, redirecting to: admin");
            return res.redirect("/admin");
        }

        if (!req.session.user) {
            logger.info("No user found in session, redirecting to: admin");
            return res.redirect("/admin");
        }
    }

    return next();
}
