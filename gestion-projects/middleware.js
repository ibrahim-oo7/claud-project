const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "secret_key"; 

function authentificat(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(201).json({message : 'token makainchi'});
    jwt.verify(token , SECRET , (err,userData) => {
        if(err){
       
            return res.status(403).json({message : 'token ghalat'});
        } else {
            req.user = userData;
            next();
        }
    })
}
function onlyAdmin(req, res, next) {
    if (!req.user) {
        return res.sendStatus(401)
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "gha smahna osf tn machi admin" })
    }
    next()
}
module.exports = {
    authentificat,
    onlyAdmin
}