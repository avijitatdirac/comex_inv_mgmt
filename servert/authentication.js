// check session information to find if user has valid login

const auth = function(req, res, next) {
  console.log(req.url);
  console.log("username in session: ", req.session.username);
  console.log(req.session);
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
