const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const message = document.querySelector(".msg");
const time = document.querySelector(".timer");

for (let select of dropdowns) {
  for (curCode in countryList) {
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
  let CountryCode = countryList[curCode];
  let newSrc = `https://flagsapi.com/${CountryCode}/flat/64.png`;
  let img = select.parentElement.querySelector("img");
  img.src = newSrc;
};

let amountInput = document.querySelector(".from input");
amountInput.addEventListener("input", () => {
  getExchangeRate();
});

const getExchangeRate = async () => {
  const amountInput = document.querySelector(".from input");

  let amount = amountInput.value;

  if (amount <= 0) {
    amount = 1;
    amountInput.value = 1;
  }

  let fromCurrency = document.querySelector(".from select").value;
  let toCurrency = document.querySelector(".to select").value;

  const URL = `${BASE_URL}/${fromCurrency.toLowerCase()}.json`;
  const response = await fetch(URL);
  const data = await response.json();
  const exchangeRate =
    data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
  const totalExchangedAmount = (amount * exchangeRate).toFixed(2);

  document.querySelector(".to input").value = totalExchangedAmount;

  message.innerText = `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`;

  time.innerText = `Last Updated: ${data.date}`;
};
