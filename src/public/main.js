//permite vista e interaccion con el usuario
console.log("main.js cargado");

document.addEventListener("DOMContentLoaded", () => { //se ejecuta solo si...
    // Usamos delegación de eventos:
    // Un solo listener para todos los clicks en el documento.
    document.addEventListener("click", async (event) => {
        // 1) Votar TEMA
        const topicButton = event.target.closest(".btn-vote-topic");
        if (topicButton) {
            const topicId = topicButton.getAttribute("data-topic-id");

            try {
                // Primero votamos el tema
                await fetch(`/topics/${topicId}/vote`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}) //envio en formato...
                });

                // Luego pedimos la página de /topics para obtener la lista actualizada
                const response = await fetch("/topics");
                const html = await response.text();

                // Parseamos el HTML y sacamos solo el #topics-list
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                const newList = doc.querySelector("#topics-list"); //actualizo la lista
                const currentList = document.querySelector("#topics-list");

                if (newList && currentList) {
                    currentList.innerHTML = newList.innerHTML;
                }
            } catch (error) {
                console.error("Error al votar tema:", error);
            }

            //salir de la función para no procesar esto también como enlace
            return;
        }

        // 2) Votar ENLACE
        const linkButton = event.target.closest(".btn-vote-link");
        if (linkButton) {
            const topicId = linkButton.getAttribute("data-topic-id");
            const linkId = linkButton.getAttribute("data-link-id");

            try {
                const response = await fetch(`/topics/${topicId}/links/${linkId}/vote`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({})
                });

                if (!response.ok) {
                    console.error("Error al votar enlace:", response.status);
                    return;
                }

                const data = await response.json();

                const votesSpan = document.querySelector(
                    `.link-votes[data-topic-id="${topicId}"][data-link-id="${linkId}"]`
                );

                if (votesSpan) {
                    votesSpan.textContent = data.votes;
                }
            } catch (error) {
                console.error("Error en la solicitud de voto de enlace:", error);
            }
        }
    });
});