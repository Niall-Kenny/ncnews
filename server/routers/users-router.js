const userRouter = require("express").Router();
const { fetchUser } = require("../controllers/controller-users");

userRouter.get("/:username", fetchUser);
module.exports = userRouter;
