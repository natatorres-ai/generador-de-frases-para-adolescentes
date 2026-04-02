const PHRASE_BANK = {
    "Responsabilidad": {
        "Reflexivo": [
            "Tus decisiones diarias son los ladrillos con los que construyes tu propia realidad.",
            "Asumir la autoría de tus errores te otorga el poder de corregirlos con madurez.",
            "La libertad real comienza en el momento en que decides hacerte cargo de ti."
        ],
        "Firme": [
            "Cumplir con tu palabra es la base del respeto que los demás te tendrán.",
            "Nadie hará por ti el trabajo que solo te corresponde a ti completar hoy.",
            "La madurez se demuestra cuando priorizas tus compromisos sobre tus impulsos momentáneos."
        ],
        "Cercano": [
            "Sé que puedes manejar esto; confía en tu criterio para elegir lo correcto.",
            "Equivocarse es parte del proceso, lo importante es cómo decidas levantarte después.",
            "Tómate tu tiempo para decidir, pero una vez que elijas, mantente firme ahí."
        ]
    },
    "Independencia": {
        "Inspirador": [
            "Tienes la fuerza necesaria para trazar un camino que sea verdaderamente tuyo.",
            "Tu independencia crece cada vez que confías en tu capacidad para resolver problemas.",
            "No busques aprobación externa; tu propia validación es el motor más potente."
        ],
        "Sereno": [
            "Caminar a tu propio ritmo es un acto de valentía en un mundo apresurado.",
            "La autonomía se cultiva en los pequeños gestos de autocuidado que realizas a diario.",
            "Observa el mundo con tus propios ojos y saca tus propias conclusiones siempre."
        ]
    },
    "Futuro": {
        "Inspirador": [
            "Cada esfuerzo que haces hoy es una inversión en la persona que serás mañana.",
            "El futuro no se espera, se construye con las acciones que decides tomar ahora.",
            "Mantén la vista en tus metas, pero disfruta de cada paso del aprendizaje actual."
        ],
        "Reflexivo": [
            "Los grandes cambios suelen ser el resultado de pequeñas decisiones tomadas con constancia.",
            "Piensa en grande, empieza pequeño y mantén siempre la curiosidad por aprender algo nuevo.",
            "Tu potencial es una semilla que requiere paciencia y cuidado para florecer plenamente."
        ]
    },
    "Crecimiento": {
        "Firme": [
            "El crecimiento personal requiere salir de la zona de confort de forma consciente.",
            "Acepta los desafíos como oportunidades para descubrir fortalezas que aún no conoces.",
            "La disciplina personal es el puente entre tus deseos y tus logros reales."
        ],
        "Sereno": [
            "Permítete evolucionar y cambiar de opinión a medida que adquieres nuevas experiencias.",
            "La madurez no llega con la edad, sino con la observación atenta de la vida.",
            "Valora tu progreso, incluso si parece lento; cada paso cuenta en tu evolución."
        ]
    }
};

const TEMAS = Object.keys(PHRASE_BANK);
const HISTORY_KEY = 'adolescent_phrases_history';

// Elements
const phraseText = document.getElementById('phrase-text');
const metaSection = document.getElementById('phrase-meta');
const metaTheme = document.getElementById('meta-theme');
const metaTone = document.getElementById('meta-tone');
const themeSelect = document.getElementById('theme-select');
const toneSelect = document.getElementById('tone-select');
const generateBtn = document.getElementById('generate-btn');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const toggleHistoryBtn = document.getElementById('toggle-history');
const clearHistoryBtn = document.getElementById('clear-history');

let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

function updateHistoryUI() {
    historyList.innerHTML = '';
    history.slice().reverse().forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.fecha}: ${entry.frase}`;
        historyList.appendChild(li);
    });
}

function generatePhrase() {
    let selectedTheme = themeSelect.value;
    const selectedTone = toneSelect.value;

    if (selectedTheme === 'SORPRESA') {
        selectedTheme = TEMAS[Math.floor(Math.random() * TEMAS.length)];
    }

    let candidates = [];
    if (PHRASE_BANK[selectedTheme][selectedTone]) {
        candidates = PHRASE_BANK[selectedTheme][selectedTone];
    } else {
        // Fallback: all phrases for the theme
        Object.values(PHRASE_BANK[selectedTheme]).forEach(list => {
            candidates = candidates.concat(list);
        });
    }

    // Filter out history
    const historyPhrases = history.map(h => h.frase);
    const newCandidates = candidates.filter(c => !historyPhrases.includes(c));

    const finalPool = newCandidates.length > 0 ? newCandidates : candidates;
    const resultPhrase = finalPool[Math.floor(Math.random() * finalPool.length)];

    displayPhrase(resultPhrase, selectedTheme, selectedTone);
    
    // Save only if not in history or if we reset
    if (!historyPhrases.includes(resultPhrase)) {
        const entry = {
            fecha: new Date().toLocaleDateString(),
            frase: resultPhrase,
            tema: selectedTheme,
            tono: selectedTone
        };
        history.push(entry);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        updateHistoryUI();
    }
}

function displayPhrase(text, theme, tone) {
    phraseText.style.opacity = '0';
    setTimeout(() => {
        phraseText.textContent = `"${text}"`;
        metaTheme.textContent = theme;
        metaTone.textContent = tone;
        metaSection.classList.remove('hidden');
        phraseText.style.opacity = '1';
    }, 300);
}

// Events
generateBtn.addEventListener('click', generatePhrase);

toggleHistoryBtn.addEventListener('click', () => {
    historyPanel.classList.toggle('hidden');
    toggleHistoryBtn.textContent = historyPanel.classList.contains('hidden') ? 'Ver Historial' : 'Ocultar Historial';
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('¿Borrar todo el historial?')) {
        history = [];
        localStorage.removeItem(HISTORY_KEY);
        updateHistoryUI();
    }
});

// Init
updateHistoryUI();
// Auto generate one if manual is preferred, or just leave it blank for WOW factor on click.
