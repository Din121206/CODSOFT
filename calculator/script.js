// Calculator functionality
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Function to append values to display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    // Handle operators
    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput !== '' && operator !== '' && previousInput !== '') {
            calculateResult();
        }
        operator = value;
        previousInput = currentInput;
        currentInput = '';
        display.value += value;
    } else {
        // Handle numbers and decimal point
        if (value === '.' && currentInput.includes('.')) {
            return; // Prevent multiple decimal points
        }
        currentInput += value;
        display.value += value;
    }
}

// Function to clear the display
function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

// Function to delete last character
function deleteLast() {
    if (display.value.length > 0) {
        let lastChar = display.value.slice(-1);
        display.value = display.value.slice(0, -1);
        
        // Update currentInput if the last character was a number or decimal
        if (!isNaN(lastChar) || lastChar === '.') {
            currentInput = currentInput.slice(0, -1);
        } else if (['+', '-', '*', '/'].includes(lastChar)) {
            // If operator was deleted, restore previous state
            operator = '';
            currentInput = previousInput;
            previousInput = '';
        }
    }
}

// Function to calculate result
function calculateResult() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let result;
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    
    // Use if-else statements for different operations
    if (operator === '+') {
        result = prev + current;
    } else if (operator === '-') {
        result = prev - current;
    } else if (operator === '*') {
        result = prev * current;
    } else if (operator === '/') {
        if (current === 0) {
            alert('Error: Division by zero!');
            clearDisplay();
            return;
        }
        result = prev / current;
    }
    
    // Round result to avoid floating point precision issues
    result = Math.round(result * 100000000) / 100000000;
    
    display.value = result;
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    shouldResetDisplay = true;
}

// Add keyboard support using event listeners
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Handle numbers
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    }
    // Handle operators
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    }
    // Handle decimal point
    else if (key === '.') {
        appendToDisplay(key);
    }
    // Handle equals or Enter key
    else if (key === '=' || key === 'Enter') {
        event.preventDefault();
        calculateResult();
    }
    // Handle clear (Escape key)
    else if (key === 'Escape') {
        clearDisplay();
    }
    // Handle backspace
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Add click sound effect (optional enhancement)
function playClickSound() {
    // Create audio context for button click feedback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add click sound to all buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });
});

// Initialize display
display.value = '';
