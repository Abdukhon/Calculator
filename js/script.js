 // ---------- Verbindung die HTML Tags mit JavaScript: DOM ----------
const exprDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const historyList = document.getElementById('history');

// ---------- ----------
let tokens = [];               // Liste der eingegebenen Zahlen und Operatoren, z.B. ["12", "+", "7"]
let currentNumber = '';        // Das aktuell eingegebene Zahl (noch nicht in tokens)
let lastExpression = null;     // Speichert das Ausdruck nach dem Drücken von "=" für halbtransparente Anzeige
let justEvaluated = false;     // Flag: gerade "=" gedrückt, warten auf neue Eingabe

// ---------- Herunterladen wir von Speicher die Dateien ----------
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// ---------- Funktionen ----------
function getExpressionText() {
    // Kombinieren Sie die Tokens und die aktuelle Zahl zu einem einzigen String für die Anzeige
    return tokens.join('') + currentNumber;
}

function updateDisplay() {
    const exprText = getExpressionText() || '0';
    exprDisplay.textContent = exprText;

    // Wenn nur gerade "=" gedrückt wurde, zeigen wir das gespeicherte Ausdruck
    if (justEvaluated && lastExpression) {
    exprDisplay.textContent = lastExpression;
    }

    // Berechnen Sie das Live-Ergebnis aus den Tokens (inklusive currentNumber, wenn vorhanden)
    const liveResult = calculateFromTokens();
    resultDisplay.textContent = liveResult !== null ? liveResult : '';
}

// Berechnet das Ergebnis aus den Tokens (und currentNumber, wenn vorhanden)
function calculateFromTokens() {
    const allTokens = [...tokens];
    if (currentNumber !== '') {
        allTokens.push(currentNumber);
    }

    if (allTokens.length === 0) return '0';

    // Beginnen wir mit der ersten Zahl
    let value = parseFloat(allTokens[0]);
    if (isNaN(value)) return 'Fehler';

    for (let i = 1; i < allTokens.length; i += 2) {
        const operator = allTokens[i];
        const nextNumber = allTokens[i + 1];

        // Wenn das nächste Zahl fehlt (Operator am Ende),
        // geben wir den aktuellen Wert zurück, ohne die unvollständige Operation als Fehler zu betrachten.
        if (nextNumber === undefined || nextNumber === '') {
        return value;
        }

        const num = parseFloat(nextNumber);
        if (isNaN(num)) return 'Fehler';

        switch (operator) {
        case '+': value += num; break;
        case '-': value -= num; break;
        case '*': value *= num; break;
        case '/': 
            if (num === 0) return 'Fehler'; // Division durch Null ist nicht erlaubt
            value /= num; 
            break;
        default: return 'Fehler'; // Unbekannter Operator
        }
    }
    return value;
}

// Ändern Sie die Transparenz der Displays basierend auf dem Modus (normal oder gerade "=" gedrückt)
function updateOpacityStyles() {
    if (justEvaluated) {
    // Nach "=" ist der oberste Teil verblassen, der untere Teil sichtbar
    exprDisplay.classList.add('faded');
    resultDisplay.classList.remove('faded');
    } else {
    // Normalmodus: beide Teile sind sichtbar
    exprDisplay.classList.remove('faded');
    resultDisplay.classList.add('faded');
    }
}

// Rendert die Anzeige und die Transparenz basierend auf dem aktuellen Zustand
function render() {
    updateDisplay();
    updateOpacityStyles();
    renderHistory();
}

// ---------- Geschichte ----------
function addToHistory(expression, result) {
    history.push({ expression, result, timestamp: Date.now() });
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    // Zeigen wir die letzten 10 Einträge an (neueste oben)
    history.slice(-10).reverse().forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${entry.expression}</span><strong>${entry.result}</strong>`;
    historyList.appendChild(li);
    });
}
function clearHistory() {
  // 1. Leeren Sie die Geschichte im Speicher (Variable und localStorage)
    history = [];

    // 2. Entfernen Sie die gespeicherte Geschichte aus localStorage
    localStorage.removeItem('calcHistory');

    // 3. Aktualisieren Sie die Anzeige der Geschichte
    renderHistory();
}
// ---------- Alle zurücksetzen ----------
function clearAll() {
    tokens = [];
    currentNumber = '';
    lastExpression = null;
    justEvaluated = false;
    render();
}

// Beginn eines neuen Eingabevorgangs nach "=" (Flag zurücksetzen, Bereinigung, Transparenz zurücksetzen)
function startFresh() {
    if (justEvaluated) {
    tokens = [];
    currentNumber = '';
    lastExpression = null;
    justEvaluated = false;
    }
}

// ---------- Obere Handlers ----------

function handleDigit(digit) {
    startFresh(); // wenn war Mode "=", beginnen wir von vorne

    // Wir erlauben nicht, mehrere Nullen am Anfang einzugeben
    if (digit === '0' && currentNumber === '0') return;
    // Wir ersetzen die führende Null, wenn eine andere Ziffer eingegeben wird
    if (currentNumber === '0' && digit !== '.') {
    currentNumber = digit;
    } else {
    currentNumber += digit;
    }
    render();
}

function handleDecimal() {
    startFresh();
    if (currentNumber === '') currentNumber = '0';  // ".5" -> "0.5"
    if (currentNumber.includes('.')) return;        // Punkt bereits vorhanden
    currentNumber += '.';
    render();
}

function handleOperator(op) {
    startFresh();

    // Wenn der Benutzer noch nichts eingegeben hat, aber einen Operator drücken möchte,
    // fügen wir automatisch eine 0 hinzu (wie in einem Taschenrechner üblich)
    if (tokens.length === 0 && currentNumber === '') {
    currentNumber = '0';
    }

    // Wenn gerade eine Zahl eingegeben wird, fügen wir sie zu den Tokens hinzu, bevor wir den Operator hinzufügen
    if (currentNumber !== '') {
    tokens.push(currentNumber);
    currentNumber = '';
    }

    // Wenn der letzte Token bereits ein Operator ist, ersetzen wir ihn durch den neuen (z.B. "12 +" -> "12 -")
    if (tokens.length > 0 && ['+','-','*','/'].includes(tokens[tokens.length - 1])) {
    tokens[tokens.length - 1] = op;
    } else {
    tokens.push(op);
    }

    render();
}

function handleDelete() {
    if (justEvaluated) {
    // Nach "=" macht DEL nichts (man kann einfach zurücksetzen, aber besser nicht komplizieren)
    return;
    }

    if (currentNumber.length > 0) {
    currentNumber = currentNumber.slice(0, -1);
    } else if (tokens.length > 0) {
    // Wenn gerade keine Zahl eingegeben wird, aber es gibt Tokens, entfernen wir den letzten Token.
    const removed = tokens.pop();
    if (removed !== undefined && ['+','-','*','/'].includes(removed) && tokens.length > 0) {
        // Wenn der letzte Token ein Operator ist, machen wir das letzte Zahl zum aktuellen, um sie zu bearbeiten
        currentNumber = tokens.pop() || '';
    }
    }
    render();
}

function handlePercent() {
    startFresh();
    if (currentNumber !== '') {
    const num = parseFloat(currentNumber);
    if (!isNaN(num)) {
        // Prozent — das ist eine Hundertstel-Teil einer Zahl
        currentNumber = (num / 100).toString();
    }
    }
    render();
}

function handleEquals() {
    // Wir erlauben nicht, ein leeres Ausdruck zu speichern
    if (tokens.length === 0 && currentNumber === '') return;

    // Wenn gerade eine Zahl eingegeben wird, fügen wir sie zu den Tokens hinzu, bevor wir die Berechnung durchführen
    if (currentNumber !== '') {
    tokens.push(currentNumber);
    currentNumber = '';
    }

    // Wenn das Ausdruck mit einem Operator endet — entfernen wir ihn (unvollständiges Ausdruck)
    if (['+','-','*','/'].includes(tokens[tokens.length - 1])) {
    tokens.pop();
    }

    // Bekommen wir das Ergebnis aus den Tokens
    const result = calculateFromTokens();
    if (result === 'Fehler' || result === null) {
    clearAll();
    return;
    }

    // Kombinieren Sie die Tokens zu einem einzigen String für die Geschichte und die halbtransparente Anzeige
    const expressionText = tokens.join('');

    // Fügen Sie das Ausdruck und das Ergebnis zur Geschichte hinzu
    addToHistory(expressionText, result);

    // Speichern Sie das Ausdruck mit "=" für die halbtransparente Anzeige
    lastExpression = expressionText + ' =';
    justEvaluated = true;

    // Bereinigen Sie die Tokens und die aktuelle Zahl für die nächste Eingabe
    tokens = [];
    currentNumber = '';

    // Zeigen Sie das Ergebnis an
    resultDisplay.textContent = result;

    // Aktualisieren Sie die Transparenz, um den Modus "gerade '=' gedrückt" anzuzeigen
    updateOpacityStyles();
    renderHistory();
}

// ---------- die Verbindung der Ereignisse mit den Funktionen ----------
document.querySelectorAll('[data-digit]').forEach(btn => {
    btn.addEventListener('click', () => handleDigit(btn.getAttribute('data-digit')));
});

document.querySelectorAll('[data-operator]').forEach(btn => {
    btn.addEventListener('click', () => handleOperator(btn.getAttribute('data-operator')));
});

document.getElementById('clearBtn').addEventListener('click', clearAll);
document.getElementById('deleteBtn').addEventListener('click', handleDelete);
document.getElementById('percentBtn').addEventListener('click', handlePercent);
document.getElementById('equalsBtn').addEventListener('click', handleEquals);
document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

// Initialisierung
clearAll(); // stellt korrekte anfängliche Werte ein und rendert