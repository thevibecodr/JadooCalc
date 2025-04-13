document.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('.btn');
    const soundToggle = document.getElementById('soundToggle');
    const colorToggle = document.getElementById('colorToggle');
    const colorPicker = document.getElementById('colorPicker');
    const colorOptions = document.querySelectorAll('.color-option');
    const calculator = document.querySelector('.calculator');
    
    const sounds = {
        B: document.getElementById('soundB'),
        C: document.getElementById('soundC'),
        D: document.getElementById('soundD'),
        E: document.getElementById('soundE'),
        F: document.getElementById('soundF')
    };
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetInput = false;
    let displayValue = '0';
    let operationDisplay = '0';
    let fullExpression = '';
    let resultValue = '';
    let soundSequences = [
        ['B', 'C', 'F', 'E'],
        ['B', 'C', 'E', 'D']
    ];
    let currentSequenceIndex = 0;
    let currentSoundIndex = 0;
    let isSoundEnabled = true;
    let currentTheme = 'cyan';

    function toggleSound() {
        isSoundEnabled = !isSoundEnabled;
        const soundIcon = soundToggle.querySelector('i');
        soundIcon.className = isSoundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        soundToggle.classList.toggle('muted', !isSoundEnabled);
    }

    function toggleColorPicker() {
        colorPicker.classList.toggle('active');
        // Keep the color icon unchanged
    }

    function changeTheme(color) {
        // Remove all existing theme classes
        document.body.classList.remove('theme-cyan', 'theme-green', 'theme-purple', 'theme-pink', 'theme-yellow', 'theme-orange', 'theme-blue', 'theme-red', 'theme-white');
        
        // Add the new theme class
        document.body.classList.add(`theme-${color}`);
        
        // Update the grid color by adding a data attribute to the body
        document.body.setAttribute('data-theme', color);
        
        // Hide the color picker
        const colorPicker = document.querySelector('.color-picker');
        colorPicker.classList.remove('active');
    }

    function playNextSound() {
        if (!isSoundEnabled) return;
        
        const currentSequence = soundSequences[currentSequenceIndex];
        const soundKey = currentSequence[currentSoundIndex];
        const sound = sounds[soundKey];
        sound.currentTime = 0;
        sound.play();
        
        // Move to next sound in sequence
        currentSoundIndex = (currentSoundIndex + 1) % currentSequence.length;
        
        // If we've completed a sequence, switch to the other sequence
        if (currentSoundIndex === 0) {
            currentSequenceIndex = (currentSequenceIndex + 1) % soundSequences.length;
        }
    }

    function updateDisplay() {
        const inputDisplay = document.getElementById('inputDisplay');
        const resultDisplay = document.getElementById('resultDisplay');
        
        // Only update top display when equals is pressed
        if (operationDisplay.includes('=')) {
            inputDisplay.value = operationDisplay;
        } else {
            inputDisplay.value = '0';
        }
        
        // Always show the current expression in bottom display
        resultDisplay.value = fullExpression || currentInput;
    }

    function handleNumber(num) {
        if (shouldResetInput) {
            currentInput = num;
            fullExpression = previousInput + operation + num;
            shouldResetInput = false;
        } else {
            currentInput = currentInput === '0' ? num : currentInput + num;
            fullExpression = operation ? previousInput + operation + currentInput : currentInput;
        }
        
        updateDisplay();
    }

    function handleOperator(op) {
        if (operation !== null && !shouldResetInput) {
            calculate();
        }
        previousInput = currentInput;
        operation = op;
        fullExpression = previousInput + op;
        shouldResetInput = true;
        
        updateDisplay();
    }

    function calculate() {
        if (operation === null || shouldResetInput) return;
        
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            default:
                return;
        }

        // Format the result
        result = parseFloat(result.toFixed(10));
        
        // Update displays
        operationDisplay = previousInput + operation + currentInput + ' =';
        currentInput = result.toString();
        fullExpression = result.toString();
        
        const inputDisplay = document.getElementById('inputDisplay');
        const resultDisplay = document.getElementById('resultDisplay');
        
        inputDisplay.value = operationDisplay;
        resultDisplay.value = result.toLocaleString();
        
        operation = null;
        shouldResetInput = true;
    }

    function handleClear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        shouldResetInput = false;
        operationDisplay = '0';
        fullExpression = '';
        const inputDisplay = document.getElementById('inputDisplay');
        const resultDisplay = document.getElementById('resultDisplay');
        inputDisplay.value = '0';
        resultDisplay.value = '0';
    }

    function handleEquals() {
        if (operation !== null) {
            calculate();
        }
    }

    function handleDecimal() {
        if (shouldResetInput) {
            currentInput = '0.';
            shouldResetInput = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    function handlePlusMinus() {
        currentInput = String(-parseFloat(currentInput));
        updateDisplay();
    }

    // Add sound toggle event listener
    soundToggle.addEventListener('click', toggleSound);
    
    // Add color toggle event listener
    colorToggle.addEventListener('click', toggleColorPicker);
    
    // Add color option event listeners
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-color');
            changeTheme(theme);
        });
    });

    // Close color picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!colorPicker.contains(e.target) && !colorToggle.contains(e.target)) {
            colorPicker.classList.remove('active');
        }
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            playNextSound();

            if (!isNaN(value) || value === '.') {
                if (value === '.') {
                    handleDecimal();
                } else {
                    handleNumber(value);
                }
            } else {
                switch (value) {
                    case 'C':
                        handleClear();
                        break;
                    case '±':
                        handlePlusMinus();
                        break;
                    case '=':
                        handleEquals();
                        break;
                    default:
                        handleOperator(value);
                }
            }
        });
    });
    
    // Initialize with default theme
    changeTheme('cyan');
}); 