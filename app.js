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
  // Puzzle state
  puzzle: {
    imageUrl: 'assets/Peppa_Pig-garden.png',
    originalImage: null,
    puzzlePieces: [],
    rows: 4,
    cols: 4,
    pieceWidth: 0,
    pieceHeight: 0,
    puzzleWidth: 0,
    puzzleHeight: 0,
    draggingPiece: null,
    dragOffsetX: 0,
    dragOffsetY: 0
  }
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
        <button class="main-btn" data-route="puzzle">
          🧩 Jigsaw Puzzle
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

function viewPuzzle() {
  return `
    <div class="nav-screen">
      <div class="nav-bar">
        <button class="back-btn" data-route="home">←</button>
        <h2 class="screen-title">Jigsaw Puzzle</h2>
        <div></div>
      </div>
      
      <div class="screen-content">
        <p class="screen-description">Drag and drop pieces to solve the puzzle!</p>
        
        <div class="puzzle-game-area">
          <div class="puzzle-area">
            <div id="puzzle-container" class="puzzle-container">
              <!-- Puzzle grid will go here -->
            </div>
          </div>
          
          <div class="pieces-area">
            <div id="pieces-container" class="pieces-container">
              <!-- Puzzle pieces will go here -->
            </div>
          </div>
        </div>
        
        <div class="puzzle-controls">
          <button class="control-btn" id="startPuzzleBtn">
            🎯 Start New Puzzle
          </button>
          <input type="file" id="imageUpload" accept="image/*" style="display: none;">
          <button class="control-btn secondary" id="uploadImageBtn">
            📸 Upload Image
          </button>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-link" data-route="home">← Back to Home</button>
        </div>
      </div>
    </div>
    
    <!-- Success Modal -->
    <div id="successModal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">🎉 Congratulations! 🎉</h2>
        </div>
        <div class="modal-body">
          <p class="modal-message">You solved the puzzle!</p>
          <div class="modal-celebration">
            <span class="celebration-emoji">✨</span>
            <span class="celebration-emoji">🎊</span>
            <span class="celebration-emoji">🎉</span>
            <span class="celebration-emoji">✨</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn primary" id="playAgainBtn">
            🎯 Play Again
          </button>
          <button class="modal-btn secondary" id="closeModalBtn">
            ✨ Awesome!
          </button>
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
  } else if (state.route === 'puzzle') {
    html = viewPuzzle();
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
  } else if (state.route === 'puzzle') {
    setupPuzzleInteractions();
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
  }
  
  function prevCard() {
    state.currentIndex = (state.currentIndex - 1 + state.currentDeck.length) % state.currentDeck.length;
    showCard();
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

// Puzzle functionality
function setupPuzzleInteractions() {
  const startBtn = document.getElementById('startPuzzleBtn');
  const uploadBtn = document.getElementById('uploadImageBtn');
  const imageUpload = document.getElementById('imageUpload');
  
  if (startBtn) {
    startBtn.addEventListener('click', initializePuzzle);
  }
  
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => imageUpload.click());
  }
  
  if (imageUpload) {
    imageUpload.addEventListener('change', handleImageUpload);
  }
  
  // Initialize puzzle on first load
  setTimeout(() => initializePuzzle(), 100);
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      state.puzzle.imageUrl = e.target.result;
      const newImage = new Image();
      newImage.onload = function() {
        state.puzzle.originalImage = newImage;
        initializePuzzle();
      };
      newImage.onerror = function() {
        alert('Error loading image. Please try a different image.');
      };
      newImage.src = state.puzzle.imageUrl;
    };
    reader.onerror = function() {
      alert('Error reading file. Please try a different image.');
    };
    reader.readAsDataURL(file);
  }
}

function initializePuzzle() {
  const puzzleContainer = document.getElementById('puzzle-container');
  const piecesContainer = document.getElementById('pieces-container');
  
  if (!puzzleContainer || !piecesContainer) return;
  
  // Clear previous puzzle
  puzzleContainer.innerHTML = '';
  piecesContainer.innerHTML = '';
  state.puzzle.puzzlePieces = [];
  state.puzzle.draggingPiece = null;

  // If originalImage is already loaded, proceed directly
  if (state.puzzle.originalImage && state.puzzle.originalImage.complete && state.puzzle.originalImage.naturalWidth > 0) {
    setupPuzzle();
  } else {
    // Otherwise, wait for the image to load
    const img = new Image();
    img.onload = () => {
      state.puzzle.originalImage = img;
      setupPuzzle();
    };
    img.onerror = () => {
      alert('Error loading image. Please try a different image.');
    };
    img.src = state.puzzle.imageUrl;
  }
}

function setupPuzzle() {
  const puzzleContainer = document.getElementById('puzzle-container');
  const piecesContainer = document.getElementById('pieces-container');
  
  if (!puzzleContainer || !piecesContainer) return;
  
  const { originalImage, rows, cols } = state.puzzle;
  
  // Calculate available space for the puzzle based on viewport
  const availableWidth = Math.min(window.innerWidth * 0.8, 400); // 35% of screen width, max 500px
  const availableHeight = Math.min(window.innerHeight * 0.5, 400); // 50% of screen height, max 400px
  
  // Set puzzle dimensions based on image aspect ratio and available space
  const imageAspectRatio = originalImage.width / originalImage.height;
  
  if (originalImage.width <= availableWidth && originalImage.height <= availableHeight) {
    // Image fits in available space, use original dimensions
    state.puzzle.puzzleWidth = originalImage.width;
    state.puzzle.puzzleHeight = originalImage.height;
  } else {
    // Scale image to fit available space while maintaining aspect ratio
    const scaleByWidth = availableWidth / originalImage.width;
    const scaleByHeight = availableHeight / originalImage.height;
    const scale = Math.min(scaleByWidth, scaleByHeight);
    
    state.puzzle.puzzleWidth = originalImage.width * scale;
    state.puzzle.puzzleHeight = originalImage.height * scale;
  }

  state.puzzle.pieceWidth = state.puzzle.puzzleWidth / cols;
  state.puzzle.pieceHeight = state.puzzle.puzzleHeight / rows;

  console.log('Puzzle dimensions:', state.puzzle.puzzleWidth, 'x', state.puzzle.puzzleHeight);
  console.log('Piece dimensions:', state.puzzle.pieceWidth, 'x', state.puzzle.pieceHeight);

  // Set CSS properties
  puzzleContainer.style.setProperty('--puzzle-width', `${state.puzzle.puzzleWidth}px`);
  puzzleContainer.style.setProperty('--puzzle-height', `${state.puzzle.puzzleHeight}px`);
  puzzleContainer.style.setProperty('grid-template-columns', `repeat(${cols}, 1fr)`);
  puzzleContainer.style.width = `${state.puzzle.puzzleWidth}px`;
  puzzleContainer.style.height = `${state.puzzle.puzzleHeight}px`;
  
  // Create grid slots and puzzle pieces
  createGridSlots();
  createPuzzlePieces();
  shufflePieces();
  addDragAndDropListeners();
}

function createGridSlots() {
  const puzzleContainer = document.getElementById('puzzle-container');
  const { rows, cols, pieceWidth, pieceHeight } = state.puzzle;
  
  puzzleContainer.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const slot = document.createElement('div');
      slot.classList.add('grid-slot');
      slot.dataset.slotRow = r;
      slot.dataset.slotCol = c;
      slot.style.width = `${pieceWidth}px`;
      slot.style.height = `${pieceHeight}px`;
      slot.style.border = '1px dashed #ccc';
      slot.style.boxSizing = 'border-box';
      puzzleContainer.appendChild(slot);
    }
  }
}

function createPuzzlePieces() {
  const { rows, cols, pieceWidth, pieceHeight, puzzleWidth, puzzleHeight, imageUrl } = state.puzzle;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece');
      piece.dataset.row = r;
      piece.dataset.col = c;
      piece.dataset.originalIndex = r * cols + c;

      // Calculate background position for each piece
      const bgX = -c * pieceWidth;
      const bgY = -r * pieceHeight;

      piece.style.backgroundImage = `url(${imageUrl})`;
      piece.style.backgroundPosition = `${bgX}px ${bgY}px`;
      piece.style.setProperty('--piece-size', `${pieceWidth}px`);
      piece.style.backgroundSize = `${puzzleWidth}px ${puzzleHeight}px`;

      state.puzzle.puzzlePieces.push(piece);
    }
  }
}

function shufflePieces() {
  const piecesContainer = document.getElementById('pieces-container');
  if (!piecesContainer) return;
  
  // Fisher-Yates shuffle
  for (let i = state.puzzle.puzzlePieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.puzzle.puzzlePieces[i], state.puzzle.puzzlePieces[j]] = [state.puzzle.puzzlePieces[j], state.puzzle.puzzlePieces[i]];
  }

  // Append shuffled pieces to container
  const fragment = document.createDocumentFragment();
  state.puzzle.puzzlePieces.forEach(piece => {
    fragment.appendChild(piece);
    piece.classList.remove('placed');
    piece.style.position = 'static';
    piece.style.left = '';
    piece.style.top = '';
    piece.style.border = '2px solid var(--text)';
    piece.style.borderRadius = '4px';
    piece.style.boxShadow = 'var(--shadow)';
  });
  piecesContainer.appendChild(fragment);
}

function addDragAndDropListeners() {
  state.puzzle.puzzlePieces.forEach(piece => {
    piece.addEventListener('mousedown', startDrag);
    piece.addEventListener('touchstart', startDrag, { passive: false });
    
    // Add visual feedback on touch
    
  });
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag);
}

function startDrag(event) {
  if (event.target.classList.contains('placed')) return;
  
  event.preventDefault();
  state.puzzle.draggingPiece = event.target;
  state.puzzle.draggingPiece.classList.add('dragging');
  
  const rect = state.puzzle.draggingPiece.getBoundingClientRect();
  if (event.type === 'touchstart') {
    state.puzzle.dragOffsetX = event.touches[0].clientX - rect.left;
    state.puzzle.dragOffsetY = event.touches[0].clientY - rect.top;
  } else {
    state.puzzle.dragOffsetX = event.clientX - rect.left;
    state.puzzle.dragOffsetY = event.clientY - rect.top;
  }
  
  // Set initial position to prevent jumping
  state.puzzle.draggingPiece.style.position = 'absolute';
  state.puzzle.draggingPiece.style.zIndex = '1000';
}

function drag(event) {
  if (!state.puzzle.draggingPiece) return;
  
  event.preventDefault();
  
  let newX, newY;
  if (event.type === 'touchmove') {
    newX = event.touches[0].clientX - state.puzzle.dragOffsetX;
    newY = event.touches[0].clientY - state.puzzle.dragOffsetY;
  } else {
    newX = event.clientX - state.puzzle.dragOffsetX;
    newY = event.clientY - state.puzzle.dragOffsetY;
  }

  // Position relative to viewport for smoother dragging
  state.puzzle.draggingPiece.style.left = `${newX}px`;
  state.puzzle.draggingPiece.style.top = `${newY}px`;
}

function endDrag(event) {
  if (!state.puzzle.draggingPiece) return;
  
  state.puzzle.draggingPiece.classList.remove('dragging');
  checkPlacement(state.puzzle.draggingPiece);
  state.puzzle.draggingPiece = null;
}

function checkPlacement(piece) {
  const puzzleContainer = document.getElementById('puzzle-container');
  const piecesContainer = document.getElementById('pieces-container');
  
  if (!puzzleContainer || !piecesContainer) return;
  
  const puzzleRect = puzzleContainer.getBoundingClientRect();
  const pieceRect = piece.getBoundingClientRect();

  const originalIndex = parseInt(piece.dataset.originalIndex);
  const targetRow = Math.floor(originalIndex / state.puzzle.cols);
  const targetCol = originalIndex % state.puzzle.cols;

  const targetX = targetCol * state.puzzle.pieceWidth;
  const targetY = targetRow * state.puzzle.pieceHeight;

  const currentX = pieceRect.left - puzzleRect.left;
  const currentY = pieceRect.top - puzzleRect.top;

  const toleranceX = state.puzzle.pieceWidth * 0.3; // Increased tolerance
  const toleranceY = state.puzzle.pieceHeight * 0.3;

  if (
    Math.abs(currentX - targetX) < toleranceX &&
    Math.abs(currentY - targetY) < toleranceY
  ) {
    // Snap to grid and mark as placed
    piece.style.position = 'static';
    piece.style.left = '';
    piece.style.top = '';
    piece.style.zIndex = '';
    piece.style.border = 'none';
    piece.style.borderRadius = '0';
    piece.style.boxShadow = 'none';
    piece.style.width = `${state.puzzle.pieceWidth}px`;
    piece.style.height = `${state.puzzle.pieceHeight}px`;
    piece.classList.add('placed');
    piece.removeEventListener('mousedown', startDrag);
    piece.removeEventListener('touchstart', startDrag);
    
    // Move piece to puzzle container at correct grid position
    const targetSlot = document.querySelector(`[data-slot-row="${targetRow}"][data-slot-col="${targetCol}"]`);
    if (targetSlot && !targetSlot.querySelector('.puzzle-piece.placed')) {
      targetSlot.appendChild(piece);
      playPlacementSound();
    }
    
    checkWinCondition();
  } else {
    // Return piece to pieces container with smooth animation
    piece.style.position = 'static';
    piece.style.left = '';
    piece.style.top = '';
    piece.style.zIndex = '';
    piece.style.border = '2px solid var(--text)';
    piece.style.borderRadius = '4px';
    piece.style.boxShadow = 'var(--shadow)';
    piece.style.transition = 'all 0.3s ease';
    
    // Find a good position in the pieces container
    const pieces = piecesContainer.querySelectorAll('.puzzle-piece:not(.placed)');
    const pieceIndex = Array.from(pieces).indexOf(piece);
    
    if (pieceIndex >= 0) {
      // Insert at the same position to maintain order
      const nextPiece = pieces[pieceIndex + 1];
      if (nextPiece) {
        piecesContainer.insertBefore(piece, nextPiece);
      } else {
        piecesContainer.appendChild(piece);
      }
    } else {
      piecesContainer.appendChild(piece);
    }
    
    // Remove transition after animation
    setTimeout(() => {
      piece.style.transition = '';
    }, 300);
  }
}

function checkWinCondition() {
  const placedPieces = document.querySelectorAll('.puzzle-piece.placed').length;
  if (placedPieces === state.puzzle.rows * state.puzzle.cols) {
    playWinSound();
    setTimeout(() => {
      showSuccessModal();
    }, 500);
  }
}

function playPlacementSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    // Ignore audio errors
  }
}

function playWinSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const duration = 0.3;
    
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, index * 150);
    });
  } catch (e) {
    // Ignore audio errors
  }
}

// Modal functions
function showSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('modal-show');
    
    // Add modal event listeners
    const playAgainBtn = document.getElementById('playAgainBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        hideSuccessModal();
        initializePuzzle();
      });
    }
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', hideSuccessModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideSuccessModal();
      }
    });
  }
}

function hideSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('modal-show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
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