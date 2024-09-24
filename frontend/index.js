import { backend } from 'declarations/backend';

let currentInput = '';
let currentOperator = '';
let previousInput = '';

const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const decimalButton = document.querySelector('.decimal');

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentInput += button.textContent;
        updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentInput !== '') {
            if (previousInput !== '') {
                calculate();
            }
            currentOperator = button.textContent;
            previousInput = currentInput;
            currentInput = '';
        }
    });
});

equalsButton.addEventListener('click', calculate);

clearButton.addEventListener('click', () => {
    currentInput = '';
    currentOperator = '';
    previousInput = '';
    updateDisplay();
});

decimalButton.addEventListener('click', () => {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
});

function updateDisplay() {
    display.value = currentInput;
}

async function calculate() {
    if (previousInput !== '' && currentInput !== '' && currentOperator !== '') {
        const x = parseFloat(previousInput);
        const y = parseFloat(currentInput);
        let result;

        try {
            switch (currentOperator) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    const divisionResult = await backend.divide(x, y);
                    if ('ok' in divisionResult) {
                        result = divisionResult.ok;
                    } else {
                        throw new Error(divisionResult.err);
                    }
                    break;
            }

            currentInput = result.toString();
            previousInput = '';
            currentOperator = '';
            updateDisplay();
        } catch (error) {
            display.value = 'Error: ' + error.message;
            currentInput = '';
            previousInput = '';
            currentOperator = '';
        }
    }
}
