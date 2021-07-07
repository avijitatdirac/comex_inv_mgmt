// check session information to find if user has valid login

const auth = function(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    if (req.method === "GET") {
      res.redirect("/login");
    } else if (req.method === "POST") {
      res.status(403).json({ message: "User session not found" });
    } else {
      res.status(403).json({ message: "User session not found" });
    }
  }
};

module.exports = auth;
