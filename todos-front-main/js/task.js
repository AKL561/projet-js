const API_BASE = "https://totolist-qen1.vercel.app/api";


function asTodoArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.todolist)) return data.todolist;
  if (Array.isArray(data) && data[0] && Array.isArray(data[0].todolist)) return data[0].todolist;
  return [];
}

document.addEventListener("DOMContentLoaded", () => {
  const taskListDiv = document.getElementById("app");

  const prenom = localStorage.getItem("prenom");
  if (!prenom) {
    window.location.href = "index.html";
    return;
  }

  // Formulaire d’ajout
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

  // Charger les tâches existantes
  fetch(`${API_BASE}/todos`)
    .then(r => { if (!r.ok) throw new Error("Erreur lors de la récupération"); return r.json(); })
    .then(data => {
      const taches = asTodoArray(data);
      if (!taches.length) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Aucune tâche disponible.";
        taskListDiv.appendChild(emptyMsg);
        return;
      }
      taches.forEach(tache => afficherTache(taskListDiv, tache));
    })
    .catch(err => {
      console.error("Erreur :", err);
      taskListDiv.innerHTML = "<p>Impossible de charger les tâches.</p>";
    });

  // Ajouter une tâche
  addBtn.addEventListener("click", () => {
    const texte = input.value.trim();
    if (!texte) return alert("Veuillez entrer un nom de tâche.");

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
      .then(res => { if (!res.ok) throw new Error("Erreur lors de l'ajout"); return res.json(); })
      .then(data => {
        afficherTache(taskListDiv, data);
        input.value = "";
      })
      .catch(err => {
        console.error("Erreur :", err);
        alert("Erreur lors de l'ajout de la tâche.");
      });
  });

  function afficherTache(container, tache) {
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
      <h3>${tache.text}</h3>
      <p>Créée le : ${tache.created_at}</p>
      <p>Statut : ${tache.is_complete ? "✅ Terminée" : "🕒 À faire"}</p>
      <p>Tags : ${Array.isArray(tache.Tags) && tache.Tags.length ? tache.Tags.join(", ") : "Aucun"}</p>
      <hr>
    `;
    const button = document.createElement("button");
    button.textContent = "Voir les détails";
    button.onclick = () => { window.location.href = `item.html?id=${tache.id}`; };
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
    button.addEventListener("mouseout", () => { button.style.backgroundColor = "#1abc9c"; button.style.transform = "scale(1)"; });

    div.appendChild(button);
    container.appendChild(div);
  }
});
  
  
  