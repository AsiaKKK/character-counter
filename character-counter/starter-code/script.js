const textInput = document.getElementById("text-input");

//result grid
const charCountContainer = document.getElementById("char-count");
const wordCountContainer = document.getElementById("word-count");
const sentenceCountContainer = document.getElementById("sent-count");

//no characters found container
const notFoundText = document.querySelector(".not-found");

//density result
const letterDensityWrapper = document.querySelector(".letter-density-wrapper");
const letterDensityContainer = letterDensityWrapper.querySelector(".letter-density");
const expandBtn = document.querySelector(".expand-btn");

//checkboxes
const excludeSpacesChck = document.querySelector("#exclude-spaces");
const charLimitChck = document.querySelector("#char-limit");
const textLimitInput = document.querySelector("#text-limit");

// warning message
const warning = document.querySelector(".warning");

//toggle mode btn
const toggleMode = document.querySelector(".theme-toggle");

let inputValue;
let totalCharacters = 0;
let wordCount = 1;
let sentenceCount = 0;

toggleMode.addEventListener("click", (e) => {
    const btnImg = e.currentTarget.querySelector("img");
    const logoImg = document.querySelector("#logo-img");

    if(e.target.classList.contains("dark")){
        document.body.classList.add("light-mode");
        btnImg.src = "./assets/images/icon-moon.svg";
        e.target.classList.remove("dark");
        logoImg.src = "./assets/images/logo-light-theme.svg";
    }
    else{
        document.body.classList.remove("light-mode");
        btnImg.src = "./assets/images/icon-sun.svg";
        e.target.classList.add("dark");
        logoImg.src = "./assets/images/logo-dark-theme.svg";
    }
})

charLimitChck.addEventListener("click", (e) => {
    textLimitInput.classList.toggle("visible");
}) 

textInput.addEventListener('keydown', (e) => {
    if(e.key === "Enter"){
        totalCharacters = 0;
        wordCount = 1;
        sentenceCount = 0;
        letterDensityContainer.replaceChildren();
        warning.classList.remove("visible");

        let hasSpaces;

        e.preventDefault();
        inputValue = e.currentTarget.value;
        e.currentTarget.value = "";

        warning.classList.remove("visible");
        textInput.classList.remove("invalid");
        notFoundText.classList.add("hidden");
        let lettersArray = inputValue.split("");

        lettersArray.forEach(letter => {
        if(letter === " "){
            wordCount++;
        }else if(letter === "?" || letter === "." || letter === "!"){
            sentenceCount++;
        }else{
            totalCharacters++;                
        }
    
        });

        let lettersSorted = lettersArray.sort();

        if(excludeSpacesChck.checked && charLimitChck.checked){
            hasSpaces = true;
            if(textLimitInput){
                if(textLimitInput.value < inputValue.length){
                    warning.classList.add("visible");
                    textInput.classList.add("invalid");
                    warning.querySelector("span").innerText = inputValue.length;
                    notFoundText.classList.remove("hidden");
                    letterDensityWrapper.classList.remove("visible");
                }else{
                    divideIntoGroups(lettersSorted, hasSpaces);
                    showGridResults(totalCharacters, wordCount, sentenceCount);
                }
            }else{
                divideIntoGroups(lettersSorted, hasSpaces);
                showGridResults(totalCharacters, wordCount, sentenceCount);
            }

        }
        else if(excludeSpacesChck.checked){
            hasSpaces = true;
            divideIntoGroups(lettersSorted, hasSpaces);
            showGridResults(totalCharacters, wordCount, sentenceCount);

        }else if (charLimitChck.checked) {
            hasSpaces = false;
            if(textLimitInput){
                if(textLimitInput.value < inputValue.length){
                    
                    warning.classList.add("visible");
                    textInput.classList.add("invalid");
                    warning.querySelector("span").innerText = inputValue.length;
                    notFoundText.classList.remove("hidden");
                    letterDensityWrapper.classList.remove("visible");
                }else{
                    divideIntoGroups(lettersSorted, hasSpaces);
                    showGridResults(totalCharacters, wordCount, sentenceCount);
                }
            }else{
                divideIntoGroups(lettersSorted, hasSpaces);
                showGridResults(totalCharacters, wordCount, sentenceCount);
            }
        }
        else{
            hasSpaces = false;
            divideIntoGroups(lettersSorted, hasSpaces);
            showGridResults(totalCharacters, wordCount, sentenceCount);
        }

       
        
       
    }

    
})

function showGridResults(totalCharacters, wordCount, sentenceCount){
    charCountContainer.textContent = totalCharacters;
    wordCountContainer.textContent = wordCount;
    sentenceCountContainer.textContent = sentenceCount;
}

function divideIntoGroups(table, hasSpaces){
    let resultArray = [];
    let currentArray = [];

    for (let i = 0; i < table.length; i++) {
        if (i === 0 || table[i] === table[i - 1]) {
            currentArray.push(table[i]);
    
        } else {
            resultArray.push(currentArray);
            currentArray = [table[i]];
        }
    }

    if (currentArray.length) {
        resultArray.push(currentArray);
    }

    if (hasSpaces){
        resultArray.shift();
    }

    let sortedArray = resultArray.sort((a, b) => b.length - a.length);

    letterDensityWrapper.classList.add("visible");

    sortedArray.forEach(grupa =>{
        // console.log(grupa.length, grupa[0]);

        let percent = (grupa.length/table.length*100).toFixed(2);
        
        let div = document.createElement('div'); 
        div.classList.add('single-letter');

        div.innerHTML = `
        <p class="letter">${grupa[0]}</p>
        <div class="scope-stripe">
            <div class="result-stripe"></div>
        </div>
        <p class="count">${grupa.length} (${percent}%)</p>`;

        let scopeStripe = div.querySelector(".scope-stripe");
        let resultStripe = div.querySelector(".result-stripe");

        function updateWidth() {
            let scopeWidth = scopeStripe.clientWidth;
            resultStripe.style.width = `${percent * scopeWidth / 100}px`;
        }

        updateWidth();

        window.addEventListener("resize", updateWidth);
        letterDensityContainer.appendChild(div);
    })


    return resultArray;

}

expandBtn.addEventListener("click", (e) => {
    if(e.target.classList.contains("expand")){
        letterDensityContainer.style.height = "auto";
        letterDensityContainer.style.overflowY = "visible";
        e.target.innerHTML = `
        See less
        <img src="./assets/images/collapse.png" alt="arrow down">
        `
        e.target.classList.remove("expand");
    }else{
        letterDensityContainer.style.height = "153px";
        letterDensityContainer.style.overflowY = "hidden";
        e.target.innerHTML = `
        See more
        <img src="./assets/images/expand.png" alt="arrow down">
        `
        e.target.classList.add("expand");
    }
    

})

