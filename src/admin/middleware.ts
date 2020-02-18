import {Request, Response, NextFunction} from 'express';

export function validate(req: Request, res: Response, next: NextFunction) {

    if (req.originalUrl.startsWith("/admin/")) {
        if (!req.session) {
            return res.redirect('/admin');
        }
        
        if (!req.session.user) {
            return res.redirect('/admin');
        }
    }
    
    return next();
}