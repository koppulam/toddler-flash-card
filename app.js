// App state and data
const appRoot = document.getElementById('app');

const state = {
  route: 'home',
  // Word families: rime patterns only (two letters)
  families: [
    'at','an','ad','ap','ag','am','ab',
    'et','en','eg','ed',
    'it','in','ig','ip',
    'ot','op','og','ob','od','ox',
    'ut','un','ug','ub','um','up',
  ],
  selectedRimes: [],
  cvc: [
    // CVC words with 'a'
    'cat', 'bat', 'hat', 'mat', 'rat', 'sat', 'pat', 'fat', 'vat',
    'can', 'ban', 'fan', 'man', 'pan', 'ran', 'tan', 'van',
    'cap', 'gap', 'lap', 'map', 'nap', 'rap', 'sap', 'tap',
    'bag', 'gag', 'lag', 'nag', 'rag', 'sag', 'tag', 'wag',
    'bad', 'dad', 'had', 'lad', 'mad', 'pad', 'sad',
    'bam', 'ham', 'jam', 'ram', 'yam',
    'cab', 'dab', 'gab', 'jab', 'lab', 'nab', 'tab',
    
    // CVC words with 'e'
    'bed', 'fed', 'led', 'red', 'wed',
    'bet', 'get', 'jet', 'let', 'met', 'net', 'pet', 'set', 'vet', 'wet', 'yet',
    'beg', 'leg', 'peg',
    'den', 'hen', 'men', 'pen', 'ten', 'yen',
    
    // CVC words with 'i'
    'bit', 'fit', 'hit', 'kit', 'lit', 'pit', 'sit', 'wit',
    'big', 'dig', 'fig', 'gig', 'jig', 'pig', 'rig', 'wig',
    'bin', 'fin', 'kin', 'pin', 'sin', 'tin', 'win',
    'dip', 'hip', 'lip', 'rip', 'sip', 'tip', 'zip',
    
    // CVC words with 'o'
    'bog', 'cog', 'dog', 'fog', 'hog', 'jog', 'log',
    'cot', 'dot', 'got', 'hot', 'jot', 'lot', 'not', 'pot', 'rot', 'tot',
    'cop', 'hop', 'mop', 'pop', 'top',
    'bob', 'cob', 'job', 'mob', 'rob', 'sob',
    'cod', 'god', 'nod', 'pod', 'rod',
    'box', 'fox', 'pox',
    
    // CVC words with 'u'
    'bug', 'dug', 'hug', 'jug', 'lug', 'mug', 'rug', 'tug',
    'bun', 'fun', 'gun', 'nun', 'pun', 'run', 'sun',
    'but', 'cut', 'gut', 'hut', 'jut', 'nut', 'rut',
    'bum', 'gum', 'hum', 'mum', 'sum',
    'cup', 'pup', 'sup',
    'cub', 'hub', 'rub', 'sub', 'tub'
  ],
  currentDeck: [],
  currentIndex: 0,
  ttsVoice: null,
};

// Utility functions
function setRoute(route) {
  state.route = route;
  render();
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  if (state.ttsVoice) utter.voice = state.ttsVoice;
  utter.rate = 0.9; // slower for kids
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildFamilyDeck() {
  return shuffle([...state.families]);
}

function buildCvcDeck() {
  if (state.selectedRimes && state.selectedRimes.length > 0) {
    const filtered = state.cvc.filter(word => 
      state.selectedRimes.some(rime => word.endsWith(rime))
    );
    return shuffle(filtered);
  }
  return shuffle([...state.cvc]);
}

// View functions
function viewHome() {
  return `
    <div class="home-screen">
      <div class="logo-container">
        <div class="logo">⭐</div>
        <div class="logo-sparkles">
          <span class="sparkle">✨</span>
          <span class="sparkle">✨</span>
        </div>
      </div>
      
      <h1 class="app-title">
        <span style="font-size: 1.1em;">Kiddo</span><br>
        Flashcards
      </h1>
      
      <div class="main-buttons">
        <button class="main-btn" data-route="families">
          📚 Word Families
        </button>
        <button class="main-btn" data-route="cvc">
          🔤 CVC Words
        </button>
      </div>
      
      <div class="tip-box">
        💡 Tap a card to hear the word!
      </div>
    </div>
  `;
}

function viewFamilies() {
  const deck = buildFamilyDeck();
  state.currentDeck = deck;
  state.currentIndex = 0;
  
  return `
    <div class="nav-screen">
      <div class="nav-bar">
        <button class="back-btn" data-route="home">←</button>
        <h2 class="screen-title">Word Families</h2>
        <div></div>
      </div>
      
      <div class="screen-content">
        <p class="screen-description">See and say the rime patterns (two letters).</p>
        
        <div class="control-buttons">
          <button class="control-btn" id="sayBtn">
            🔊 Say It
          </button>
          <button class="control-btn secondary" id="mixBtn">
            🎲 Mix Up
          </button>
        </div>
        
        <div class="flashcard" id="flashcard">
          <span class="flashcard-sparkle">✨</span>
          <h3 class="flashcard-text" id="flashText">${deck[0] || ''}</h3>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-link" id="prevBtn">← Previous</button>
          <button class="nav-link" id="nextBtn">Next →</button>
        </div>
      </div>
    </div>
  `;
}

function viewCvc() {
  const deck = buildCvcDeck();
  state.currentDeck = deck;
  state.currentIndex = 0;
  
  return `
    <div class="nav-screen">
      <div class="nav-bar">
        <button class="back-btn" data-route="home">←</button>
        <h2 class="screen-title">CVC Words</h2>
        <div></div>
      </div>
      
      <div class="screen-content">
        <p class="screen-description">Practice simple 3-letter words!</p>
        
        <div class="family-grid" id="familyGrid">
          ${state.families.map(rime => 
            `<button class="family-btn" data-rime="${rime}">${rime}</button>`
          ).join('')}
        </div>
        
        <div class="flashcard" id="flashcard">
          <h3 class="flashcard-text" id="flashText">${deck[0] || ''}</h3>
          <div class="flashcard-illustration" id="flashIllustration">🐱</div>
        </div>
        
        <div class="control-buttons">
          <button class="control-btn" id="sayBtn">
            🔊 Say It
          </button>
          <button class="control-btn secondary" id="mixBtn">
            🎲 Mix Up
          </button>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-link" id="prevBtn">← Previous</button>
          <button class="nav-link" id="nextBtn">Next →</button>
        </div>
      </div>
    </div>
  `;
}

// Render function
function render() {
  let html = '';
  
  if (state.route === 'home') {
    html = viewHome();
  } else if (state.route === 'families') {
    html = viewFamilies();
  } else if (state.route === 'cvc') {
    html = viewCvc();
  }
  
  appRoot.innerHTML = html;
  setupEventListeners();
}

// Event listeners setup
function setupEventListeners() {
  // Route buttons
  appRoot.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => setRoute(btn.dataset.route));
  });
  
  if (state.route === 'families' || state.route === 'cvc') {
    setupDeckInteractions();
  }
}

function setupDeckInteractions() {
  const flashText = document.getElementById('flashText');
  const sayBtn = document.getElementById('sayBtn');
  const mixBtn = document.getElementById('mixBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const flashcard = document.getElementById('flashcard');
  const familyGrid = document.getElementById('familyGrid');
  
  function showCard() {
    if (flashText && state.currentDeck[state.currentIndex]) {
      const word = state.currentDeck[state.currentIndex];
      flashText.textContent = word;
      
      // Add illustration for CVC words
      if (state.route === 'cvc') {
        const illustration = document.getElementById('flashIllustration');
        if (illustration) {
          // Simple word-to-emoji mapping
          const emojiMap = {
            'cat': '🐱', 'dog': '🐕', 'sun': '☀️', 'hat': '👒', 'bat': '🦇',
            'mat': '🏠', 'rat': '🐀', 'sat': '🪑', 'pat': '👋', 'fat': '🐷',
            'can': '🥫', 'fan': '🌀', 'man': '👨', 'pan': '🍳', 'ran': '🏃',
            'cap': '🧢', 'map': '🗺️', 'nap': '😴', 'tap': '🚰', 'bag': '👜',
            'tag': '🏷️', 'bed': '🛏️', 'red': '🔴', 'wet': '💧', 'net': '🕸️',
            'pet': '🐾', 'set': '⚙️', 'jet': '✈️', 'big': '🐘', 'pig': '🐷',
            'dig': '⛏️', 'wig': '💇', 'bin': '🗑️', 'pin': '📌', 'win': '🏆',
            'hot': '🌡️', 'pot': '🍯', 'box': '📦', 'fox': '🦊', 'bug': '🐛',
            'mug': '☕', 'sun': '☀️', 'run': '🏃', 'fun': '😄', 'gun': '🔫',
            'cup': '☕', 'pup': '🐶', 'cub': '🐻', 'tub': '🛁'
          };
          illustration.textContent = emojiMap[word] || '📝';
        }
      }
    }
  }
  
  function nextCard() {
    state.currentIndex = (state.currentIndex + 1) % state.currentDeck.length;
    showCard();
    speak(flashText.textContent);
  }
  
  function prevCard() {
    state.currentIndex = (state.currentIndex - 1 + state.currentDeck.length) % state.currentDeck.length;
    showCard();
    speak(flashText.textContent);
  }
  
  function reshuffleDeck() {
    state.currentDeck = state.route === 'families' ? buildFamilyDeck() : buildCvcDeck();
    state.currentIndex = 0;
    showCard();
  }
  
  // Event listeners
  if (flashcard) {
    flashcard.addEventListener('click', () => speak(flashText.textContent));
  }
  
  if (sayBtn) {
    sayBtn.addEventListener('click', () => speak(flashText.textContent));
  }
  
  if (mixBtn) {
    mixBtn.addEventListener('click', reshuffleDeck);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevCard);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextCard);
  }
  
  // Family selector for CVC words
  if (familyGrid) {
    familyGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-rime]');
      if (!btn) return;
      
      const rime = btn.dataset.rime;
      btn.classList.toggle('active');
      
      if (btn.classList.contains('active')) {
        if (!state.selectedRimes.includes(rime)) {
          state.selectedRimes.push(rime);
        }
      } else {
        state.selectedRimes = state.selectedRimes.filter(r => r !== rime);
      }
      
      // Rebuild deck with selected families
      state.currentDeck = buildCvcDeck();
      state.currentIndex = 0;
      showCard();
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === 'ArrowLeft') prevCard();
    if (e.key === ' ') {
      e.preventDefault();
      speak(flashText.textContent);
    }
  });
  
  // Initial card display
  showCard();
}

// Initialize voices
if ('speechSynthesis' in window) {
  function populateVoice() {
    const voices = speechSynthesis.getVoices();
    // Prefer an English child-friendly voice if available
    state.ttsVoice = voices.find(v => /en-US|en-GB/.test(v.lang) && /Child|Kids|Natural|Female/.test(v.name)) || 
                     voices.find(v => v.lang.startsWith('en')) || null;
  }
  populateVoice();
  speechSynthesis.onvoiceschanged = populateVoice;
}

// Initialize app
render();