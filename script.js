document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const restartButton = document.getElementById('restart');
    const messageDisplay = document.getElementById('message');
    const nameModal = document.getElementById('nameModal');
    const startButton = document.getElementById('startGame');
    const playerNameInput = document.getElementById('playerName');
    const container = document.querySelector('.container');
    
    let playerName = '';
    const emojis = ['❤️', '🌹', '💌', 'X', '💘', '💝', '💖', '💕'];
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;

    
    startButton.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name) {
            playerName = name;
            nameModal.style.display = 'none';
            container.style.display = 'block';
            initializeGame();
        } else {
            alert('Please enter your name to continue!');
        }
    });

    
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startButton.click();
        }
    });

    
    function initializeGame() {
        cards = [...emojis, ...emojis];
        shuffleCards();
        createBoard();
        moves = 0;
        movesDisplay.textContent = moves;
        matchedPairs = 0;
        messageDisplay.textContent = '';
        messageDisplay.classList.remove('show');
    }

    
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            
            const front = document.createElement('div');
            front.classList.add('front');
            front.textContent = '❔';
            
            const back = document.createElement('div');
            back.classList.add('back');
            back.textContent = emoji;
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
           
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        
        secondCard = this;
        checkForMatch();
        updateMoves();
    }

    function checkForMatch() {
        const isMatch = firstCard.querySelector('.back').textContent === 
                       secondCard.querySelector('.back').textContent;

        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === emojis.length) {
                showWinMessage();
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function updateMoves() {
        moves++;
        movesDisplay.textContent = moves;
    }

    function showWinMessage() {
        setTimeout(() => {
            messageDisplay.innerHTML = `You did it, ${playerName}! 💖<br><br>Will you be my special someone?`;            
            messageDisplay.classList.add('show');
            createConfetti();
            
            setTimeout(() => {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.marginTop = '20px';
                
                const yesBtn = document.createElement('button');
                yesBtn.textContent = 'Yes! ❤️';
                yesBtn.style.margin = '0 10px';
                yesBtn.onclick = () => {
                    messageDisplay.innerHTML = `${playerName}, you made me the happiest person! 😊💕`;
                    createConfetti();
                };
                
                const noBtn = document.createElement('button');
                noBtn.textContent = 'No';
                noBtn.style.margin = '0 10px';
                noBtn.onclick = () => {
                    messageDisplay.innerHTML = 'My heart will keep trying 💔';
                    setTimeout(() => {
                        messageDisplay.innerHTML += '<br>Just kidding! Please say yes? 🥺';
                    }, 1500);
                };
                
                buttonContainer.appendChild(yesBtn);
                buttonContainer.appendChild(noBtn);
                messageDisplay.appendChild(buttonContainer);
            }, 1000);
        }, 500);
    }

    function createConfetti() {
        const colors = ['#ff6b6b', '#6b6bff', '#6bff6b', '#ffd166', '#06d6a0', '#118ab2'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);
            
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    
    restartButton.addEventListener('click', () => {
        gameBoard.innerHTML = '';
        initializeGame();
    });

    initializeGame();
});
