document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const h1 = document.querySelector(".masthead-heading.text-uppercase.mb-0");
  const container = document.getElementById("app");

  if (!id || isNaN(id)) {
    if (h1) h1.textContent = "ID invalide";
    if (container) container.textContent = "Tâche non trouvée.";
    return;
  }

  fetch("https://totolist-qen1.vercel.app/api/todos")
    .then(res => res.json())
    .then(data => {
      const task = data.find((t) => String(t.id) === String(id));

      if (!task) {
        if (h1) h1.textContent = "Tâche introuvable";
        if (container) container.textContent = "Aucune tâche ne correspond à cet ID.";
        return;
      }

      // ✅ Affichage du titre
      if (h1) {
        h1.textContent = task.text;
      }

      // ✅ Affichage des détails + boutons
      container.innerHTML = `
        <h2>${task.text}</h2>
        <p>Créée le : ${task.created_at}</p>
        <p>Statut : <strong>${task.is_complete ? "✅ Terminée" : "🕒 À faire"}</strong></p>
        <p>Tags : ${Array.isArray(task.Tags) ? task.Tags.join(", ") : "Aucun"}</p>
        <button id="toggleBtn" class="btn btn-sm btn-primary me-2">
          ${task.is_complete ? "Réouvrir" : "Marquer comme terminée"}
        </button>
        <button id="deleteBtn" class="btn btn-sm btn-danger ms-2">Supprimer</button>
      `;
      

      // ✅ Gestion du bouton de changement de statut
      document.getElementById("toggleBtn").addEventListener("click", () => {
        const updatedTask = { ...task, is_complete: !task.is_complete };

        fetch(`https://totolist-qen1.vercel.app/api/todos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask)
        })
        .then(() => location.reload())
        .catch(() => alert("Erreur lors de la mise à jour."));
      });

      // ✅ Gestion du bouton de suppression
      document.getElementById("deleteBtn").addEventListener("click", () => {
        if (confirm("Supprimer cette tâche ?")) {
          fetch(`https://totolist-qen1.vercel.app/api/todos/${id}`, {
            method: "DELETE"
          })
          .then(() => {
            if (h1) h1.textContent = "Tâche supprimée";
            container.innerHTML = "<p>Tâche supprimée.</p>";
          })
          .catch(() => alert("Erreur lors de la suppression."));
        }
      });
    })
    .catch(error => {
      console.error("Erreur de chargement :", error);
      if (h1) h1.textContent = "Erreur réseau";
      if (container) container.textContent = "Impossible de charger la tâche.";
    });




        
        
      });
  
  
  