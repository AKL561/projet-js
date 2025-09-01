document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://totolist-qen1.vercel.app/api";
  const taskListDiv = document.getElementById("app");

  const prenom = localStorage.getItem("prenom");
  if (!prenom) {
    window.location.href = "index.html";
    return;
  }

  // Formulaire (désactivé tant que le backend n'a pas de POST)
  const formDiv = document.createElement("div");
  formDiv.classList.add("mb-4");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nouvelle tâche (désactivé – pas de POST côté API)";
  input.classList.add("form-control", "mb-2");
  input.disabled = true;

  const addBtn = document.createElement("button");
  addBtn.textContent = "Ajouter une tâche (bientôt)";
  addBtn.classList.add("btn", "btn-secondary");
  addBtn.disabled = true;

  formDiv.appendChild(input);
  formDiv.appendChild(addBtn);
  taskListDiv.prepend(formDiv);

  // Charger les tâches existantes (GET)
  fetch(`${API_BASE}/todos`)
    .then((response) => {
      if (!response.ok) throw new Error("Erreur lors de la récupération");
      return response.json();
    })
    .then((tasks) => {
      // tasks est un array: [{id, title, is_complete}]
      if (!Array.isArray(tasks) || tasks.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Aucune tâche disponible.";
        taskListDiv.appendChild(emptyMsg);
        return;
      }

      tasks.forEach((t) => {
        afficherTache(taskListDiv, t);
      });
    })
    .catch((error) => {
      console.error("Erreur :", error);
      taskListDiv.innerHTML = "<p>Impossible de charger les tâches.</p>";
    });

  // Affichage d'une tâche (adapté au format de l'API)
  function afficherTache(container, tache) {
    const div = document.createElement("div");
    div.classList.add("task");

    Object.assign(div.style, {
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      marginBottom: "15px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    });

    div.innerHTML = `
      <h3>${tache.title}</h3>
      <p>Statut : ${tache.is_complete ? "✅ Terminée" : "🕒 À faire"}</p>
      <hr>
    `;

    const button = document.createElement("button");
    button.textContent = "Voir les détails";
    button.onclick = () => {
      window.location.href = `item.html?id=${tache.id}`;
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
      transition: "background-color 0.3s ease, transform 0.2s ease",
    });

    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#2c3e50";
      button.style.transform = "scale(1.03)";
    });

    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#1abc9c";
      button.style.transform = "scale(1)";
    });

    div.appendChild(button);
    container.appendChild(div);
  }
});