

const listeDiv = document.getElementById("liste");
const ajouterBtn = document.getElementById("ajouter");
const sauverBtn = document.getElementById("sauver");

let remplacements = {};

// Charger les remplacements existants
chrome.storage.local.get(["remplacements"], result => {
    remplacements = result.remplacements || {};
    afficherListe();
});

function afficherListe() {
    listeDiv.innerHTML = "";
    for (const [code, nom] of Object.entries(remplacements)) {
        const div = document.createElement("div");
        div.innerHTML = `<input type="text" class="code" value="${code}" placeholder="Code"> → 
                         <input type="text" class="nom" value="${nom}" placeholder="Nom">
                         <button class="supprimer">❌</button>`;
        div.querySelector(".supprimer").addEventListener("click", () => {
            delete remplacements[code];
            afficherListe();
        });
        listeDiv.appendChild(div);
    }
}

// Ajouter un nouveau champ vide
ajouterBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.innerHTML = `<input type="text" class="code" placeholder="Code"> → 
                     <input type="text" class="nom" placeholder="Nom">
                     <button class="supprimer">❌</button>`;
    div.querySelector(".supprimer").addEventListener("click", () => {
        div.remove();
    });
    listeDiv.appendChild(div);
});

// Sauvegarder dans chrome.storage
sauverBtn.addEventListener("click", () => {
    const nouveaux = {};
    listeDiv.querySelectorAll("div").forEach(div => {
        const code = div.querySelector(".code").value.trim();
        const nom = div.querySelector(".nom").value.trim();
        if (code && nom) nouveaux[code] = nom;
    });
    remplacements = nouveaux;
    chrome.storage.local.set({ remplacements }, () => {
        alert("Remplacements sauvegardés ✅");
    });
});
