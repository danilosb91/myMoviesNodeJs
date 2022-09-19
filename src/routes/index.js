const { Router } = require("express");

const userRoutes = require("./users.routes");
const moviesNotesRoutes = require("./moviesNotes.routes");


const routes = Router();

routes.use("/users", userRoutes);
routes.use("/moviesNotes", moviesNotesRoutes);



module.exports = routes;
