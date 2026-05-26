const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const message = document.querySelector(".msg");
const time = document.querySelector(".timer");

for (let select of dropdowns) {
  for (let curCode in countryList) {
    let newOption = document.createElement("option");
    newOption.value = curCode;
    newOption.innerText = curCode;
    if (select.name === "from" && curCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && curCode === "NPR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    getExchangeRate();
  });
}

const updateFlag = (select) => {
  let curCode = select.value;
  let countryCode = countryList[curCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = select.parentElement.querySelector("img");
  img.src = newSrc;
};

let amountInput = document.querySelector(".from input");
let resetTimer;

amountInput.addEventListener("input", () => {
  clearTimeout(resetTimer);

  const val = parseFloat(amountInput.value);
  const isInvalid = amountInput.value === "" || isNaN(val) || val <= 0;

  if (isInvalid) {
    resetTimer = setTimeout(() => {
      amountInput.value = 1;
      getExchangeRate();
    }, 3000);
  } else {
    getExchangeRate();
  }
});

const getExchangeRate = async () => {
  let amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) amount = 1;

  let fromCurrency = document.querySelector(".from select").value;
  let toCurrency = document.querySelector(".to select").value;
  const URL = `${BASE_URL}/${fromCurrency.toLowerCase()}.json`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    const exchangeRate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
    const totalExchangedAmount = (amount * exchangeRate).toFixed(2);
    document.querySelector(".to input").value = totalExchangedAmount;
    message.innerText = `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`;
    time.innerText = `Last Updated: ${data.date}`;
  } catch (err) {
    message.innerText = "Failed to fetch exchange rate. Try again.";
  }
};

const swapBtn = document.querySelector(".fa-arrow-right-arrow-left");

swapBtn.addEventListener("click", () => {
  const fromSelect = document.querySelector(".from select");
  const toSelect = document.querySelector(".to select");

  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  updateFlag(fromSelect);
  updateFlag(toSelect);

  getExchangeRate();
});

getExchangeRate();