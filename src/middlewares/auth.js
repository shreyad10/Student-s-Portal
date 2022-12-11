const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "token must be present" });
    token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, "Veryverysecretkey", (err, decodedToken) => {
      if (err) {
        let message =
          err.message === "jwt expired"
            ? "token is expired"
            : "token is valid";
        return res.status(401).send({ status: false, message: message });
      }
      req.headers = decodedToken;
      next();
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { authentication };