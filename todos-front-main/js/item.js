const API_BASE = "https://totolist-qen1.vercel.app/api";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const id = Number.parseInt(idParam, 10);

  const h1 = document.querySelector(".masthead-heading.text-uppercase.mb-0");
  const container = document.getElementById("app");

  // helpers
  const setTitle = (txt) => { if (h1) h1.textContent = txt; };
  const setBody  = (html) => { if (container) container.innerHTML = html; };

  if (!idParam || Number.isNaN(id)) {
    setTitle("ID invalide");
    setBody("<p>Tâche non trouvée.</p>");
    return;
  }

  // petit état de chargement
  setTitle("Chargement…");
  setBody("<p>Chargement des détails…</p>");

  // >>> on va directement chercher /todos/:id
  fetch(`${API_BASE}/todos/${id}`)
    .then(async (res) => {
      if (res.status === 404) {
        // pas de tâche avec cet ID
        setTitle("TÂCHE INTROUVABLE");
        setBody("<p>Aucune tâche ne correspond à cet ID.</p>");
        throw new Error("Not Found");
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((task) => {
      // Sécurisation minimale si jamais l’API renvoie un objet inattendu
      if (!task || typeof task !== "object" || task.id == null) {
        setTitle("TÂCHE INTROUVABLE");
        setBody("<p>Réponse inattendue de l’API.</p>");
        return;
      }

      // Affichage
      setTitle(task.text || "Sans titre");
      setBody(`
        <h2>${task.text || "Sans titre"}</h2>
        <p>Créée le : ${task.created_at ?? "—"}</p>
        <p>Statut : <strong>${task.is_complete ? "✅ Terminée" : "🕒 À faire"}</strong></p>
        <p>Tags : ${
          Array.isArray(task.Tags) && task.Tags.length ? task.Tags.join(", ") : "Aucun"
        }</p>

        <button id="toggleBtn" class="btn btn-sm btn-primary me-2">
          ${task.is_complete ? "Réouvrir" : "Marquer comme terminée"}
        </button>
        <button id="deleteBtn" class="btn btn-sm btn-danger ms-2">Supprimer</button>
      `);

      // Toggle statut
      document.getElementById("toggleBtn")?.addEventListener("click", () => {
        const updated = { ...task, is_complete: !task.is_complete };
        fetch(`${API_BASE}/todos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
          .then((r) => {
            if (!r.ok) throw new Error("PUT failed");
            location.reload();
          })
          .catch(() => alert("Erreur lors de la mise à jour."));
      });

      // Suppression
      document.getElementById("deleteBtn")?.addEventListener("click", () => {
        if (!confirm("Supprimer cette tâche ?")) return;
        fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" })
          .then((r) => {
            if (!r.ok) throw new Error("DELETE failed");
            setTitle("Tâche supprimée");
            setBody("<p>Tâche supprimée.</p>");
          })
          .catch(() => alert("Erreur lors de la suppression."));
      });
    })
    .catch((err) => {
      // si on n’a pas déjà affiché un message 404 plus haut
      if (err.message !== "Not Found") {
        setTitle("Erreur réseau");
        setBody("<p>Impossible de charger la tâche.</p>");
        console.error("Erreur de chargement :", err);
      }
    });
});