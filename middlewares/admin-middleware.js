const adminMiddleware = async(req, res, next) =>{
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if(req.user.isAdmin === false) {
            return res.status(401).json({error: 'Not an Admin'})  
        }
        next()
    } catch (error) {
        next(error)
    }

}

export {adminMiddleware}