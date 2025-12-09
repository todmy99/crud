const topicModel = require("../models/topicModel");

// GET /topics
function listTopics(req, res) {
    const topics = topicModel.getAllTopics(); //ahora usamos getAllTopics()
    res.render("topics", { topics });
}

// POST /topics
function createTopic(req, res) {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
        return res.redirect("/topics");
    }

    topicModel.createTopic(title.trim(), description || "");
    res.redirect("/topics");
}

// POST /topics/:id/vote
function voteTopic(req, res) {
    const id = parseInt(req.params.id, 10);

    const updatedTopic = topicModel.voteTopic(id);
    if (!updatedTopic) {
        return res.status(404).json({ error: "Tema no encontrado" });
    }

    // Respondemos con los nuevos votos
    return res.json({ votes: updatedTopic.votes });
}

// POST /topics/:id/links
function addLink(req, res) {
    const topicId = parseInt(req.params.id, 10);
    const { url, description } = req.body;

    if (!url || !url.trim()) {
        return res.redirect("/topics");
    }

    const newLink = topicModel.createLink(topicId, url.trim(), description || "");
    if (!newLink) {
        return res.status(404).send("Tema no encontrado");
    }

    // Por simplicidad, redirigimos a la lista (se verá el nuevo enlace)
    res.redirect("/topics");
}

// POST /topics/:topicId/links/:linkId/vote
function voteLink(req, res) {
    const topicId = parseInt(req.params.topicId, 10);
    const linkId = parseInt(req.params.linkId, 10);

    const updatedLink = topicModel.voteLink(topicId, linkId);
    if (!updatedLink) {
        return res.status(404).json({ error: "Tema o enlace no encontrado" });
    }

    return res.json({ votes: updatedLink.votes });
}

// POST /topics/:id/update
function updateTopic(req, res) {
    const id = parseInt(req.params.id, 10);
    const { title, description } = req.body;

    if (!title || !title.trim()) {
        return res.redirect("/topics");
    }

    const updated = topicModel.updateTopic(id, title.trim(), description || "");
    if (!updated) {
        return res.status(404).send("Tema no encontrado");
    }

    res.redirect("/topics");
}

// POST /topics/:id/delete
function deleteTopic(req, res) {
    const id = parseInt(req.params.id, 10);

    const ok = topicModel.deleteTopic(id);
    if (!ok) {
        return res.status(404).send("Tema no encontrado");
    }

    res.redirect("/topics");
}

// POST /topics/:topicId/links/:linkId/update
function updateLink(req, res) {
    const topicId = parseInt(req.params.topicId, 10);
    const linkId = parseInt(req.params.linkId, 10);
    const { url, description } = req.body;

    if (!url || !url.trim()) {
        return res.redirect("/topics");
    }

    const updated = topicModel.updateLink(topicId, linkId, url.trim(), description || "");
    if (!updated) {
        return res.status(404).send("Tema o enlace no encontrado");
    }

    res.redirect("/topics");
}

// POST /topics/:topicId/links/:linkId/delete
function deleteLink(req, res) {
    const topicId = parseInt(req.params.topicId, 10);
    const linkId = parseInt(req.params.linkId, 10);

    const ok = topicModel.deleteLink(topicId, linkId);
    if (!ok) {
        return res.status(404).send("Tema o enlace no encontrado");
    }

    res.redirect("/topics");
}

module.exports = {
    listTopics,
    createTopic,
    voteTopic,
    addLink,
    voteLink,
    updateTopic,
    deleteTopic,
    updateLink,
    deleteLink
};