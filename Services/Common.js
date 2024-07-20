const passport = require('passport');

exports.isAuth =  (req,res,done) => {
    return passport.authenticate('jwt');
}

exports.sanitizeUser = (user) => {
    return {id:user.id, role: user.role}
}

exports.cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTI1NDgxMzY2YzU2YzAwN2FmMzE1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMTQ1NzY3Mn0.gGU_DNYlhBnUVtu91XIQb31KOcOlWThiGWj_4msplkw";
    return token
}