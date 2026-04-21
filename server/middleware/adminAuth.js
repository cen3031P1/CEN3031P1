//const adminAuth = (req, res, next) => {
//    if(req.user && req.user.role == 'admin' ){
//        next();
//    } else {
//        res.status(401).json({error: "Request not authorized from admin"})
//    }
//}
//
//export default adminAuth