const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Import And Use Routers Here
/* ************************************************************************* */

const itemsRouter = require("./albums/router");

router.use("/albums", itemsRouter);

/* ************************************************************************* */

module.exports = router;
