// === tasks.js ===
// Base de l’API déployée sur Vercel
const API_BASE = "https://totolist-qen1.vercel.app/api";

/** Normalise n'importe quelle forme renvoyée par l'API en tableau de tâches */
function asTodoArray(data) {
  // soit déjà un tableau de tâches
  if (Array.isArray(data)) return data;
  // soit { todolist: [...] }
  if (data && Array.isArray(data.todolist)) return data.todolist;
  // soit [ { todolist: [...] } ]
  if (Array.isArray(data) && data[0] && Array.isArray(data[0].todolist)) {
    return data[0].todolist;
  }
  return [];
}

document.addEventListener("DOMContentLoaded", () => {
  const taskListDiv = document.getElementById("app");

  // Garde ton comportement existant (redirection si pas de prénom)
  const prenom = localStorage.getItem("prenom");
  if (!prenom) {
    window.location.href = "index.html";
    return;
  }

  // --- Formulaire d’ajout ---
  const formDiv = document.createElement("div");
  formDiv.classList.add("mb-4");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nouvelle tâche";
  input.classList.add("form-control", "mb-2");

  const addBtn = document.createElement("button");
  addBtn.textContent = "Ajouter une tâche";
  addBtn.classList.add("btn", "btn-primary");

  formDiv.appendChild(input);
  formDiv.appendChild(addBtn);
  taskListDiv.prepend(formDiv);

  // --- Charger les tâches existantes ---
  fetch(`${API_BASE}/todos`)
    .then(r => {
      if (!r.ok) throw new Error("Erreur lors de la récupération");
      return r.json();
    })
    .then(data => {
      const taches = asTodoArray(data);
      if (!taches.length) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Aucune tâche disponible.";
        taskListDiv.appendChild(emptyMsg);
        return;
      }
      taches.forEach(t => afficherTache(taskListDiv, t));
    })
    .catch(err => {
      console.error("Erreur :", err);
      taskListDiv.innerHTML = "<p>Impossible de charger les tâches.</p>";
    });

  // --- Ajouter une tâche (POST) ---
  addBtn.addEventListener("click", () => {
    const texte = input.value.trim();
    if (!texte) {
      alert("Veuillez entrer un nom de tâche.");
      return;
    }

    const nouvelleTache = {
      text: texte,
      created_at: new Date().toISOString().split("T")[0],
      is_complete: false,
      Tags: []
    };

    fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouvelleTache)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de l'ajout");
        return res.json();
      })
      .then(data => {
        // Normalise la réponse du backend (directe, tableau, wrapper…)
        const tacheCree =
          (data && data.text) ? data :
          (Array.isArray(data) && data.length ? data[data.length - 1] :
          (data?.todolist?.slice(-1)[0] || data?.[0]?.todolist?.slice(-1)[0]));

        // Si vraiment rien, on affiche au moins ce qu'on vient d'envoyer
        const safe = tacheCree || { ...nouvelleTache, id: Date.now() };

        afficherTache(taskListDiv, safe);
        input.value = "";
      })
      .catch(err => {
        console.error("Erreur :", err);
        alert("Erreur lors de l'ajout de la tâche.");
      });
  });
});

/** Affiche une carte de tâche */
function afficherTache(container, tache) {
  const titre = tache?.text || "(sans titre)";
  const date  = tache?.created_at || new Date().toISOString().split("T")[0];
  const done  = !!tache?.is_complete;
  const tags  = Array.isArray(tache?.Tags) && tache.Tags.length ? tache.Tags.join(", ") : "Aucun";

  const div = document.createElement("div");
  div.classList.add("task");
  Object.assign(div.style, {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
  });

  div.innerHTML = `
    <h3>${titre}</h3>
    <p>Créée le : ${date}</p>
    <p>Statut : ${done ? "✅ Terminée" : "🕒 À faire"}</p>
    <p>Tags : ${tags}</p>
    <hr>
  `;

  const button = document.createElement("button");
  button.textContent = "Voir les détails";
  button.onclick = () => {
    if (tache?.id != null) {
      window.location.href = `item.html?id=${tache.id}`;
    } else {
      alert("Cette tâche n’a pas encore d’identifiant.");
    }
  };

  Object.assign(button.style, {
    backgroundColor: "#1abc9c",
    color: "#ffffff",
    border: "none",
    padding: "10px 15px",
    marginTop: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease, transform 0.2s ease"
  });
  button.addEventListener("mouseover", () => { button.style.backgroundColor = "#2c3e50"; button.style.transform = "scale(1.03)"; });
  button.addEventListener("mouseout",  () => { button.style.backgroundColor = "#1abc9c"; button.style.transform = "scale(1)"; });

  div.appendChild(button);
  container.appendChild(div);
}