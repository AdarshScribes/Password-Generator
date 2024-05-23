const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// default UI
let password = "";
let passwordLength = 15;
let checkCount = 1;
handleSlider();

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min, max) {
    // explained in notebook
     return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    // here ascii value is used for a to z in lower case
    return String.fromCharCode(getRndInteger(97, 123))
    // here string.fromcharcode is used to convert number into alphabets
}

function generateUpperCase() {
    // here ascii value is used for A to Z in Upper case
    return String.fromCharCode(getRndInteger(65, 91))
    // here string.fromcharcode is used to convert number into alphabets
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    // charAt - it is for the location of a charater 
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

 async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }

    catch(e) {
         copyMsg.innerText = "Failed";
    }
    // to make copied vala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
         copyMsg.classList.remove("active");
    }, 2000);
 }

 function shufflePassword(array) {
    // fisher yates method - kisi array ke upar apply karke shuffle ho sakta hai
    // yet to add from original codes
    for (let i = array.length - 1; i > 0; i--) {
        // random j finding
        const j = Math.floor(Math.random() * (i + 1));
        // for swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
 }

 function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
 }

 allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
 })

 inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
 })

 copyBtn.addEventListener('click', () => {
    // .value is used ki koi value para hua hoga tbhi copy hoga
    if(passwordDisplay.value)
        copyContent();
 })

 generateBtn.addEventListener('click', () => {
    // none of the checkbox is selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // new password
    console.log("starting the journey");
    password = "";

    // lets put the stuff mentioned by checkbox
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    // //  6 characters left to add
    let funcArr = [];


    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    console.log("compulsory journey");


    // remaining character
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    console.log("remaining the journey");


    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffle the journey");


    // show in UI
    passwordDisplay.value = password;
    console.log("UI the journey");


    // strength
    calcStrength();



 });