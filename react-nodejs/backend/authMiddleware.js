const { verfiyJWT } = require("./utils");

const excludeAuthURLs = new Set(['/login', '/token'])

const authMiddleware = (client) => {
    return async (req, res, next) => {
        if (excludeAuthURLs.has(req.path)) {
            console.log("Bypassing JWT verification for" + req.path);
            next();
            return;
        }

        // const { ACCESS_TOKEN: accessToken } = req.signedCookies;
        // if (verfiyJWT(accessToken, jwtSigningKey)) {
        //     return next();
        // }
        
        try {
            
            let server = new URL(`https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`)
            let clientId = process.env.COGNITO_CLIENT_ID;
            let clientSecret = process.env.COGNITO_CLIENT_SECRET;
            let config = await client.discovery(
                server,
                clientId,
                clientSecret,
            )
            const { REFRESH_TOKEN: refreshToken } = req.signedCookies;
            
            if (!refreshToken) {
                res.status(401).send("Refresh Token Missing");
                return;
            }
            
            let tokens = await client.refreshTokenGrant(
                config,
                refreshToken,
            );
            
            res.cookie('ACCESS_TOKEN', tokens.access_token, { httpOnly: true, signed: true });
            return next();
        } catch (error) {
            console.error('Token Refresh Failed', error.message);
            res.status(401).send("Unauthenticated");
        }
    }
}

module.exports = authMiddleware;