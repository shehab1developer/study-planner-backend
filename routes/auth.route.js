const router = require("express").Router();
const Auth = require("../middlewares/Auth");
const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.use(Auth);
router.get("/me", getMe);

module.exports = router;
