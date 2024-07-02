const inpSlider = document.querySelector("[data-lenSlider]");
const lenDisplay = document.querySelector("[data-lengthNum]");
const passDisplay = document.querySelector("[Data-passwordDisplay]");
const copyBtn = document.querySelector(".data-copy");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseChk = document.querySelector("#uppercase");
const lowercaseChk = document.querySelector("#lowercase");
const numChk = document.querySelector("#numbers");
const symbChk = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicater]");
const generateBtn = document.querySelector(".generateBtn");
const allChkBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
//in starting 
let password = "";
let passwordLen = 10;
let checkCnt = 0;
handleSlider();
//set strength indicator color to grey
setIndicator("#ccc");

//implement functions


//set password length in UI
function handleSlider() {
    inpSlider.value = passwordLen;
    lenDisplay.innerText = passwordLen;
    const min = inpSlider.min;
    const max = inpSlider.max;
    inpSlider.style.backgroundSize = ( (passwordLen - min)*100/(max - min)) + "% 100%"
}


// set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


//random integer
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//generate random number
function genRandomNumber() {
    return getRandomInteger(0, 9);
}

//lower case
function genLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

//upper case
function genUppercase() {
    return String.fromCharCode(getRandomInteger(65, 90));
}


//symbol
function genSymbol() {
    const randomNum = getRandomInteger(0, symbols.length);
    return symbols[randomNum];
}


//strength
function calStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymb = false;

    if (uppercaseChk.checked) hasUpper = true;
    if (lowercaseChk.checked) hasLower = true;
    if (numChk.checked) hasNum = true;
    if (symbChk.checked) hasSymb = true;

    if (hasUpper && hasLower && (hasNum || hasSymb) && passwordLen >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasUpper || hasLower) && (hasNum || hasSymb) && passwordLen >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }

}

//copy content
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }


    // to make copied msg visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

//event listner on slider
inpSlider.addEventListener('input', (e) => {
    passwordLen = e.target.value;
    handleSlider();
})

//event listner on copy
copyBtn.addEventListener('click', () => {
    if (passDisplay.value) {
        copyContent();
    }
})

function shufflePassword(array) {
    //fisher yets method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckboxChange() {
    checkCnt = 0;
    allChkBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCnt++;
        }
    });

    //special condition
    if (passwordLen < checkCnt) {
        passwordLen = checkCnt;
        handleSlider();
    }
}

//event listner on all checkbox
allChkBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange)
})

//event listner on generate password
generateBtn.addEventListener('click', () => {
    //none of the check box is selected
    if (checkCnt <= 0) return;

    if (passwordLen < checkCnt) {
        passwordLen = checkCnt;
        handleSlider();
    }

    //find new password
    //remove old password
    password = "";

    // if(uppercaseChk.checked)
    // {
    //     password += genUppercase();
    // }

    // if(lowercaseChk.checked)
    // {
    //     password += genLowercase();
    // }

    // if(numChk.checked)
    // {
    //     password += genRandomNumber();
    // }

    // if(symbChk.checked)
    // {
    //     password += genSymbol();
    // }





    //create a function array and push all the functions
    let funcArr = [];
    if (uppercaseChk.checked) {
        funcArr.push(genUppercase);
    }

    if (lowercaseChk.checked) {
        funcArr.push(genLowercase);
    }

    if (numChk.checked) {
        funcArr.push(genRandomNumber);
    }

    if (symbChk.checked) {
        funcArr.push(genSymbol);
    }


    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }


    //remaining addition
    for (let i = 0; i < passwordLen - funcArr.length; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show password in the UI
    passDisplay.value = password;
    //calculate strength
    calStrength();


});