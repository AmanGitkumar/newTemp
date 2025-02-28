const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized, Invalid Token Format" });
    }

    const token = authHeader.split(" ")[1]; // ✅ Extract actual token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ✅ Attach user info to request
        next();
    } catch (error) {
        return res.status(403).json({ error: "Unauthorized, Invalid Token" });
    }
};

module.exports = ensureAuthenticated;
