//conecta URL a funciones del controlador
const express = require("express");
const router = express.Router();

const topicController = require("../controllers/topicController");

// Ver todos los temas
router.get("/", topicController.listTopics);

// Crear un nuevo tema
router.post("/", topicController.createTopic);

// Votar por un tema
router.post("/:id/vote", topicController.voteTopic);

// Crear enlace dentro de un tema
router.post("/:id/links", topicController.addLink);

// Votar por un enlace
router.post("/:topicId/links/:linkId/vote", topicController.voteLink);

// Actualizar un tema
router.post("/:id/update", topicController.updateTopic);

// Eliminar un tema
router.post("/:id/delete", topicController.deleteTopic);

// Actualizar un enlace
router.post("/:topicId/links/:linkId/update", topicController.updateLink);

// Eliminar un enlace
router.post("/:topicId/links/:linkId/delete", topicController.deleteLink);

module.exports = router;