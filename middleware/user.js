import { getvalidData } from "../auth/user.js";



export const authUser = (cookiesName) => {
  return (req, res, next) => {
    const token = req.cookies[cookiesName];
     console.log(token)
    // If no token, move to next middleware
    if (!token) {
      return next();
    }

    try {
      const payload = getvalidData(token);  // fixed typo here
      req.user = payload;
    } catch (err) {
      // Optional: log or handle invalid token
      req.user = null;
    }

    next(); // always call next() to continue the middleware chain
  };
};