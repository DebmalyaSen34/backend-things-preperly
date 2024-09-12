export async function Auth(req, res, next) {
    if(req.session.restaurantId){
        return next();
    }else{
        return res.status(401).json({error: "Unauthorized access!"});
    }
}