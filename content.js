(() => {
    'use strict';
    console.log("Extension Remplaceur INR chargée ✅");

    let remplacements = {};

    // Charger les remplacements depuis chrome.storage.local
    function chargerRemplacements(callback) {
        chrome.storage.local.get(["remplacements"], result => {
            remplacements = result.remplacements || {};
            if (callback) callback();
        });
    }

    function remplacerTexte(node) {
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentNode && ["SCRIPT", "STYLE"].includes(node.parentNode.nodeName)) return;
            let texte = node.textContent;
            for (const [code, nom] of Object.entries(remplacements)) {
                const regex = new RegExp(`\\b${code}\\b`, "g");
                texte = texte.replace(regex, nom);
            }
            if (texte !== node.textContent) node.textContent = texte;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (["SCRIPT", "STYLE"].includes(node.nodeName)) return;
            node.childNodes.forEach(remplacerTexte);
        }
    }

    function remplacerTout() {
        remplacerTexte(document.body);
        document.querySelectorAll("iframe").forEach(iframe => {
            try {
                const doc = iframe.contentDocument;
                if (!doc) return;
                remplacerTexte(doc.body);
            } catch (e) {}
        });
    }

    // Observer le DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(remplacerTexte);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Charger et appliquer les remplacements périodiquement
    chargerRemplacements(() => {
        setInterval(remplacerTout, 1000);
    });

    // Écouter les mises à jour depuis le popup
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.remplacements) {
            remplacements = changes.remplacements.newValue || {};
            remplacerTout();
        }
    });
})();
