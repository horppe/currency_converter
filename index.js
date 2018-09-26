registerServiceWorker();
attachListenerToButton();
populateCurrencies();

function registerServiceWorker(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      'https://horppe.github.io/currency_converter/sw.js',
      {scope: 'https://horppe.github.io/currency_converter/'}
    ).then(() => console.log("Service Worker Registered"))
  }
}

function populateCurrencies(){
  const currenciesUrl = "https://free.currencyconverterapi.com/api/v6/currencies";
  const currenciesPromise = fetch(currenciesUrl).then(result => result);
  currenciesPromise.then(currencies => currencies.json().then(curr => {
    const results = curr.results;
    const currArray = [];
    for(const result in results){
      currArray.push(result);
    }

    const fromElement = document.querySelector("#fromCurrency");
    const toElement = document.querySelector("#toCurrency");

    saveCurrency(currArray, fromElement, 'USD');
    saveCurrency(currArray, toElement, 'NGN');

    }));

};

function saveCurrency(currencyArray, element, defaultCurrency){
  let optionString = "";
  currencyArray.forEach(currency => {
    const shouldBeDefault = currency == defaultCurrency;
    optionString += `<option ${shouldBeDefault ? 'selected' : ''} value=${currency}>${currency}</option>`;
  });

  element.innerHTML = optionString;
}

function attachListenerToButton(){
  // Get Currencies from inputs and call convertCurrency
  const convert = () => {
    const fromValue= document.querySelector("#fromCurrency").value;
    const toValue= document.querySelector("#toCurrency").value;
    const amount= document.querySelector("#amount-input").value || 1;
    if(amount < 0){
      alert("Please enter a Non-Negative number");
      return;
    }
    convertCurrency(amount,fromValue, toValue);
    animateLogo();
  };
  document.querySelector("#convertBtn").addEventListener('click', convert);
}

let oneUnitResult;

function convertCurrency(amount, fromCurrency, toCurrency) {
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  const query = fromCurrency + '_' + toCurrency;

  const url = "https://free.currencyconverterapi.com/api/v5/convert?q=" +
            query + "&compact=y";

  const resultElement = document.getElementById('result');

  // fetch the json data from the network
  const result = fetch(url).then(function(res, err){
    return res;
  });

  // wait for the json data and get the result of the query
  result.then(function(val){
    val.json().then(function(value){
      // save the one unit value in oneUnitResult variable
    oneUnitResult = Math.floor(value[query].val) * amount;
    resultElement.innerHTML = "<i>"+oneUnitResult+"</i>";
    })
  })
}

function animateLogo(){
  const currency = document.querySelector('#currency-text');
  const converter = document.querySelector('#converter-text');
  currency.style.marginLeft = "0px";
  converter.style.marginLeft = "0px";
  setTimeout(function(){
    currency.style.marginLeft = "-30px";
    converter.style.marginLeft = "60px";
  }, 1000)
}

// The slide variable that will be incremented and looped back to 15 when it reaches 40
let slider = 15;
let state = true;
const bgAnimatorCallback = function(){ // bgAnimatorCallback will be called at every interval
  if (slider > 50) {
    state = false;
  }
  else if(slider <= 15){
    state = true
  }
  // Use state to determine if to increase slider or decrease it
  let currentValue = state ? slider++ : slider--;
  document.documentElement.style.setProperty('--bg-slider', `${currentValue}%`);
}

setInterval(bgAnimatorCallback, 100);
