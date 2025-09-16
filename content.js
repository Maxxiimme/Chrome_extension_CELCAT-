(() => {
    'use strict';

    console.log("Extension Remplaceur INR chargée ✅");

    const remplacements = {
        "INR101": "Initiation au développement",
        "INR102": "Développement d'interfaces web",
        "INR103": "Introduction à l'architecture des ordinateurs",
        "INR104": "Introduction aux systèmes d'exploitation et à leur fonctionnement",
        "INR105": "Introduction aux bases de données et SQL",
        "INR106": "Mathématiques discrètes",
        "INR107": "Outils mathématiques fondamentaux",
        "INR108": "Introduction aux bases de données et SQL",
        "INR109": "Economie durable et numérique",
        "INR110": "ANGLAIS",
        "INR111": "Communication"
    };

    function remplacerTexte(node) {
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentNode && ["SCRIPT", "STYLE"].includes(node.parentNode.nodeName)) return;
            let texte = node.textContent;
            for (const [cherche, remplace] of Object.entries(remplacements)) {
                const regex = new RegExp(`\\b${cherche}\\b`, "g");
                texte = texte.replace(regex, remplace);
            }
            if (texte !== node.textContent) node.textContent = texte;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (["SCRIPT", "STYLE"].includes(node.nodeName)) return;
            node.childNodes.forEach(remplacerTexte);
        }
    }

    // Fonction principale pour remplacer dans tout le document et iframes si possible
    function remplacerTout() {
        // Remplacement dans le body principal
        remplacerTexte(document.body);

        // Remplacement dans les iframes du même domaine
        document.querySelectorAll("iframe").forEach(iframe => {
            try {
                const doc = iframe.contentDocument;
                if (!doc) return;
                remplacerTexte(doc.body);
            } catch (e) {
                // iframe cross-origin, on ne peut pas accéder
            }
        });
    }

    // Observer le DOM principal pour tout ajout de contenu
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(remplacerTexte);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Remplacement toutes les secondes pour les contenus dynamiques lents
    setInterval(remplacerTout, 1000);
})();
