import jwt from 'jsonwebtoken';

// Middleware to verify and decode the JWT token from a cookie
export const verifyAccessToken = (req, res, next) => {
    const token = req.cookies.access_token;
    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
        console.log(token, decoded);
        if (err) {
            console.log(err);
            return res.status(401).send('Invalid access_token');
        }

        // Add the decoded payload to the request object
        req.id = decoded.id;

        // Call the next middleware function
        next();
    });
};

// Middleware to verify and decode the JWT token from body
export const verifyRefreshToken = (req, res, next) => {
    const token = req.body.refresh_token;
    jwt.verify(token, process.env.REFRESH_TOKEN_PRIVATE_KEY, (err, decoded) => {
        console.log(token, decoded);
        if (err) {
            console.log(err);
            return res.status(401).send('Invalid refresh_token');
        }

        // Add the decoded payload to the request object
        req.id = decoded.id;

        // Call the next middleware function
        next();
    });
};

// Middleware that applies verifyAccessToken to protected routes
export const protectRoute = (route) => {
    return [verifyAccessToken, route];
};
