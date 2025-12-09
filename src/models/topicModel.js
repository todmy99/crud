// src/models/topicModel.js
// "Base de datos" simple usando un archivo JSON en disco

const fs = require("fs");
const path = require("path");

// Ruta al archivo de datos
const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "topics.json");

// Asegurar que la carpeta data existe
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Cargar datos desde el archivo JSON
function loadData() {
    try {
        if (!fs.existsSync(dataFile)) {
            // Si no existe el archivo, crear uno inicial vacío
            const initialData = {
                topics: [],
                nextTopicId: 1,
                nextLinkId: 1
            };
            fs.writeFileSync(
                dataFile,
                JSON.stringify(initialData, null, 2),
                "utf8"
            );
            return initialData;
        }

        const raw = fs.readFileSync(dataFile, "utf8");
        return JSON.parse(raw);
    } catch (error) {
        console.error("Error cargando datos:", error);
        return {
            topics: [],
            nextTopicId: 1,
            nextLinkId: 1
        };
    }
}

// Guardar datos al archivo JSON
function saveData() {
    const data = {
        topics,
        nextTopicId,
        nextLinkId
    };

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");
}

// Cargamos datos al iniciar
let { topics, nextTopicId, nextLinkId } = loadData();

// 🔹 Helper: ordenar temas por votos
function sortTopicsByVotesDesc() {
    topics.sort((a, b) => b.votes - a.votes);
}

// 🔹 Helper: ordenar links por votos dentro de un tema
function sortLinksByVotesDesc(topic) {
    if (!topic || !topic.links) return;
    topic.links.sort((a, b) => b.votes - a.votes);
}

// 🔹 Obtener todos los temas (ya ordenados)
function getAllTopics() {
    sortTopicsByVotesDesc();
    return topics;
}

// 🔹 Buscar un tema por id
function findTopicById(id) {
    return topics.find((t) => t.id === id);
}

// 🔹 Crear un tema nuevo
function createTopic(title, description) {
    const newTopic = {
        id: nextTopicId++,
        title,
        description,
        votes: 0,
        links: []
    };

    topics.push(newTopic);
    sortTopicsByVotesDesc();
    saveData(); // persistimos en el archivo

    return newTopic;
}

// 🔹 Votar un tema
function voteTopic(id) {
    const topic = findTopicById(id);
    if (!topic) return null;

    topic.votes += 1;
    sortTopicsByVotesDesc();
    saveData();

    return topic;
}

// 🔹 Crear enlace dentro de un tema
function createLink(topicId, url, description) {
    const topic = findTopicById(topicId);
    if (!topic) return null;

    const newLink = {
        id: nextLinkId++,
        url,
        description,
        votes: 0
    };

    topic.links.push(newLink);
    sortLinksByVotesDesc(topic);
    saveData();

    return newLink;
}

// 🔹 Votar un enlace
function voteLink(topicId, linkId) {
    const topic = findTopicById(topicId);
    if (!topic) return null;

    const link = topic.links.find((l) => l.id === linkId);
    if (!link) return null;

    link.votes += 1;
    sortLinksByVotesDesc(topic);
    saveData();

    return link;
}

// 🔹 Actualizar un tema
function updateTopic(id, newTitle, newDescription) {
    const topic = findTopicById(id);
    if (!topic) return null;

    topic.title = newTitle;
    topic.description = newDescription;
    sortTopicsByVotesDesc();
    saveData();

    return topic;
}

// 🔹 Eliminar un tema
function deleteTopic(id) {
    const index = topics.findIndex((t) => t.id === id);
    if (index === -1) return false;

    topics.splice(index, 1);
    saveData();

    return true;
}

// 🔹 Actualizar un enlace
function updateLink(topicId, linkId, newUrl, newDescription) {
    const topic = findTopicById(topicId);
    if (!topic) return null;

    const link = topic.links.find((l) => l.id === linkId);
    if (!link) return null;

    link.url = newUrl;
    link.description = newDescription;
    sortLinksByVotesDesc(topic);
    saveData();

    return link;
}

// 🔹 Eliminar un enlace
function deleteLink(topicId, linkId) {
    const topic = findTopicById(topicId);
    if (!topic) return false;

    const index = topic.links.findIndex((l) => l.id === linkId);
    if (index === -1) return false;

    topic.links.splice(index, 1);
    saveData();

    return true;
}

module.exports = {
    getAllTopics,
    findTopicById,
    createTopic,
    voteTopic,
    createLink,
    voteLink,
    updateTopic,
    deleteTopic,
    updateLink,
    deleteLink
};