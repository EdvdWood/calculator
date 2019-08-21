//Define global Variables
let displayValue = "";
const display = document.querySelector('#output');
const legal = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const operators = ["+", "-", "*", "/"];

//Define Operators
add = (...args) => args.reduce((total, number) => total + number,
    0);

subtract = (...args) => args.reduce((total, number) => total - number,
    args[0]*2);

multiply = (...args) => args.reduce((total, number) => total * number,
    1);

divide = (...args) => args.reduce((total, number) => total/number,
    args[0]**2);

//Define logic to execute operators
operate = (input) => {
    switch (input[1]) {
        case "+":
            output = add(input[0]/1, input[2]/1);
            break;
        
        case "-":
            output = subtract(input[0], input[2]);
            break;

        case "*":
            output = multiply(input[0], input[2]);
            break;

        case "/":
            output = divide(input[0], input[2]);
            break;
    
        default:
            output = "ERROR, INVALID OR UNSUPPORTED OPERATOR";
            break;
    }
    return output;
}

//Define logic to split up longer calculations
getAnswer = () => {
    let input = display.textContent;
        input = input.split(" ");
    let operationsNum = 0;
        operationsNum= input.reduce((total, item) => (item === "*" || item === "/" || item === "+" || item === "-") 
            ? total+1 : total = total,
            0);
    for (let index = 0; index < operationsNum; index++) 
    {       if (input.some(a => a == "*" || a == "/")) 
            {       input.findIndex(a => a == "*") > input.findIndex(a => a == "/") 
                ?   input = (partialOperate(input, input.findIndex(a => a == "*")))
                :   input = (partialOperate(input, input.findIndex(a => a == "/")));
        }   else if (input.some(a => a == "+" || a == "-")) 
            {       input.findIndex(a => a == "+") > input.findIndex(a => a == "-") 
                ?   input = (partialOperate(input, input.findIndex(a => a == "+")))
                :   input = (partialOperate(input, input.findIndex(a => a == "-")));
        };
    }
    //Rounding
    displayValue = input.join();
    displayValue = displayValue*100000;
    displayValue = (Math.round(displayValue)/100000);
    displayValue = String(displayValue).split();
    display.textContent = displayValue[0];
}

//Subfunction that takes the prioritized calculation and hands it back to the main calculation.
partialOperate = (array, index) => {
    let subArray = array.splice(index-1, 3);
    let subProduct = `${operate(subArray)}`;
    array.splice(index-1,0, subProduct);
    return array;
}

//Logic for inputs (Allowing dots/operators and clearing/backspacing)
clear = () => {
    if (displayValue == []) {
        const key = document.querySelector(`button[data-value="Escape"]`);
        key.classList.add('errorBack');
    } else {
        const key = document.querySelector(`button[data-value="Escape"]`);
        key.classList.add('goodBack');
    }
    displayValue = "";
    display.textContent = "Awaiting Input";
};

back = () => {
    if (displayValue == []) {
        const key = document.querySelector(`button[data-value="Backspace"]`);
        key.classList.add('errorBack');
        display.textContent = "Awaiting Input";
    } else if (displayValue.length == 1) {
        const key = document.querySelector(`button[data-value="Backspace"]`);
        key.classList.add('goodBack');
        displayValue = "";
        display.textContent = "Awaiting Input";
    } else {
        const key = document.querySelector(`button[data-value="Backspace"]`);
        key.classList.add('goodBack');
        displayValue = displayValue.trim();
        displayValue = displayValue.substr(0, displayValue.length-1).trim();
        display.textContent = displayValue;
    }

};

addDot = () => { if (displayValue.lastIndexOf('.') > displayValue.lastIndexOf('+') &&
    displayValue.lastIndexOf('.') > displayValue.lastIndexOf('-') &&
    displayValue.lastIndexOf('.') > displayValue.lastIndexOf('*') &&
    displayValue.lastIndexOf('.') > displayValue.lastIndexOf('/')) {
        const key = document.querySelector(`button[data-value="."]`)
        key.classList.add('errorBack');
    } else {
        displayValue += "."; 
        const key = document.querySelector(`button[data-value="."]`)
        key.classList.add('goodBack');
    };
    display.textContent = displayValue;
};

addOperator = (e) => {
    if (!operators.includes(displayValue[displayValue.length-2])) {
        displayValue += ` ${e} `
        const key = document.querySelector(`button[data-value="${e}"]`)
        key.classList.add('goodBack');
    } else {
        const key = document.querySelector(`button[data-value="${e}"]`)
        key.classList.add('errorBack');
    }
    display.textContent = displayValue;
};

//Logic to turn keyboard/mouse inputs into display inputs
keyPush = (input) => {
    console.log(input)
    if (!(input == "Backspace" || input == "Escape" || input == "Enter") && displayValue.length > 19) {
        const key = document.querySelector(`button[data-value="${input}"]`);
        key.classList.add('errorBack');
        return;
    } else if (legal.includes(input)) {
        const key = document.querySelector(`button[data-value="${input}"]`);
        key.classList.add('goodBack');
        displayValue += input;
        display.textContent = displayValue;
    } else if (operators.includes(input)) {
        addOperator(input);
    } else if (input == ".") {
        addDot();
    } else if (input == "Backspace") {
        back();
    } else if (input == "=" || input == "Enter") {
        getAnswer();
    } else if (input == "Escape") {
        clear();
    } else {
        console.log("Non-legal input");
        return;
    }
}

//Wiring up the user inputs
const buttons = Array.from(document.querySelectorAll('button'));
buttons.forEach(button => button.addEventListener('click', (e) => keyPush(e.target.dataset.value)))

window.addEventListener('keydown', (e) => keyPush(e.key));

//Wiring up CSS
buttons.forEach(button => button.addEventListener('transitionend', removeTransition));

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('goodBack');
    e.target.classList.remove('errorBack');

  }