/* =========================================
   TRADE2 - TRADING INTERFACE
   Demo trading functionality
========================================= */


/* =========================================
   ASSET DATA
========================================= */

const assets = {
  AAPL: {
    name: "Apple Inc.",
    symbol: "NASDAQ: AAPL",
    price: 226.96
  },

  NVDA: {
    name: "NVIDIA Corporation",
    symbol: "NASDAQ: NVDA",
    price: 177.87
  },

  MSFT: {
    name: "Microsoft Corporation",
    symbol: "NASDAQ: MSFT",
    price: 508.30
  },

  TSLA: {
    name: "Tesla Inc.",
    symbol: "NASDAQ: TSLA",
    price: 433.91
  }
};


/* =========================================
   ELEMENTS
========================================= */

const assetSelect = document.getElementById("assetSelect");
const assetName = document.getElementById("assetName");
const assetSymbol = document.getElementById("assetSymbol");
const currentPrice = document.getElementById("currentPrice");

const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const estimatedTotal = document.getElementById("estimatedTotal");

const buyButton = document.getElementById("buyButton");
const sellButton = document.getElementById("sellButton");
const placeOrderButton = document.getElementById("placeOrder");

const orderType = document.getElementById("orderType");
const orderList = document.getElementById("orderList");

const toast = document.getElementById("toast");

const chart = document.getElementById("priceChart");
const ctx = chart.getContext("2d");


/* =========================================
   CURRENT TRADE STATE
========================================= */

let tradeSide = "BUY";
let selectedAsset = "AAPL";


/* =========================================
   UPDATE ASSET
========================================= */

function updateAsset() {

  selectedAsset = assetSelect.value;

  const asset = assets[selectedAsset];

  if (!asset) {
    return;
  }

  assetName.textContent = asset.name;
  assetSymbol.textContent = asset.symbol;

  currentPrice.textContent = "$" + asset.price.toFixed(2);

  priceInput.value = "$" + asset.price.toFixed(2);

  updateTotal();

  drawChart();
}


/* =========================================
   CALCULATE TOTAL
========================================= */

function updateTotal() {

  const asset = assets[selectedAsset];

  if (!asset) {
    return;
  }

  let quantity = Number(quantityInput.value);

  if (quantity < 0 || isNaN(quantity)) {
    quantity = 0;
  }

  const total = quantity * asset.price;

  estimatedTotal.textContent =
    "$" + total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}


/* =========================================
   BUY / SELL MODE
========================================= */

function setTradeSide(side) {

  tradeSide = side;

  if (side === "BUY") {

    buyButton.classList.add("active");
    sellButton.classList.remove("active");

    placeOrderButton.classList.remove("sell-mode");

    placeOrderButton.textContent =
      "Buy " + selectedAsset;

  } else {

    sellButton.classList.add("active");
    buyButton.classList.remove("active");

    placeOrderButton.classList.add("sell-mode");

    placeOrderButton.textContent =
      "Sell " + selectedAsset;
  }
}


/* =========================================
   BUTTON EVENTS
========================================= */

buyButton.addEventListener("click", function () {

  setTradeSide("BUY");

});


sellButton.addEventListener("click", function () {

  setTradeSide("SELL");

});


/* =========================================
   ASSET CHANGE
========================================= */

assetSelect.addEventListener("change", function () {

  updateAsset();

  setTradeSide(tradeSide);

});


/* =========================================
   QUANTITY CHANGE
========================================= */

quantityInput.addEventListener("input", function () {

  updateTotal();

});


/* =========================================
   ORDER TYPE
========================================= */

orderType.addEventListener("change", function () {

  const selectedType = orderType.value;

  if (selectedType === "market") {

    priceInput.readOnly = true;

  } else {

    priceInput.readOnly = false;

  }

});


/* =========================================
   PLACE ORDER
========================================= */

placeOrderButton.addEventListener("click", function () {

  const quantity = Number(quantityInput.value);

  if (!quantity || quantity <= 0) {

    showToast("Please enter a valid quantity.");

    quantityInput.focus();

    return;
  }


  const asset = assets[selectedAsset];

  const orderTypeText =
    orderType.options[orderType.selectedIndex].text;


  const total = quantity * asset.price;


  /* Create new order */

  const newOrder = document.createElement("div");

  newOrder.className = "table-row";


  newOrder.innerHTML = `

    <span>${selectedAsset}</span>

    <span>${orderTypeText.replace(" Order", "")}</span>

    <span class="${tradeSide === "BUY" ? "positive" : "negative"}">
      ${tradeSide}
    </span>

    <span>${quantity}</span>

    <span>$${asset.price.toFixed(2)}</span>

    <span class="status pending">
      Pending
    </span>

  `;


  /* Put newest order first */

  orderList.prepend(newOrder);


  /* Notification */

  showToast(
    `${tradeSide} order for ${quantity} ${selectedAsset} placed successfully.`
  );


  /* Reset quantity */

  quantityInput.value = 1;

  updateTotal();

});


/* =========================================
   TOAST NOTIFICATION
========================================= */

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");


  setTimeout(function () {

    toast.classList.remove("show");

  }, 3000);

}


/* =========================================
   CHART DATA
========================================= */

const chartData = [
  205,
  208,
  204,
  211,
  216,
  213,
  218,
  221,
  217,
  224,
  220,
  226,
  222,
  229,
  225,
  232,
  228,
  235,
  231,
  238,
  234,
  240,
  237,
  243,
  239,
  245,
  242,
  248,
  244,
  251,
  247,
  253,
  249,
  255,
  252,
  258,
  254,
  260,
  257,
  263
];


/* =========================================
   DRAW CHART
========================================= */

function drawChart() {

  const container = chart.parentElement;

  const width = container.clientWidth;
  const height = container.clientHeight;


  const devicePixelRatio =
    window.devicePixelRatio || 1;


  chart.width = width * devicePixelRatio;
  chart.height = height * devicePixelRatio;


  chart.style.width = width + "px";
  chart.style.height = height + "px";


  ctx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );


  ctx.clearRect(0, 0, width, height);


  /* Grid */

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;


  for (let i = 1; i < 6; i++) {

    const y = (height / 6) * i;

    ctx.beginPath();

    ctx.moveTo(0, y);
    ctx.lineTo(width, y);

    ctx.stroke();
  }


  /* Calculate values */

  const min =
    Math.min(...chartData) - 5;

  const max =
    Math.max(...chartData) + 5;


  const step =
    width / (chartData.length - 1);


  /* Area */

  ctx.beginPath();


  chartData.forEach(function (value, index) {

    const x = index * step;

    const y =
      height -
      ((value - min) / (max - min)) * height;


    if (index === 0) {

      ctx.moveTo(x, y);

    } else {

      ctx.lineTo(x, y);

    }

  });


  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();


  ctx.fillStyle =
    "rgba(34, 197, 94, 0.10)";

  ctx.fill();


  /* Line */

  ctx.beginPath();


  chartData.forEach(function (value, index) {

    const x = index * step;

    const y =
      height -
      ((value - min) / (max - min)) * height;


    if (index === 0) {

      ctx.moveTo(x, y);

    } else {

      ctx.lineTo(x, y);

    }

  });


  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2.5;

  ctx.stroke();


  /* Last point */

  const lastIndex =
    chartData.length - 1;

  const lastX =
    lastIndex * step;

  const lastY =
    height -
    ((chartData[lastIndex] - min) /
      (max - min)) * height;


  ctx.beginPath();

  ctx.arc(
    lastX,
    lastY,
    4,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "#22c55e";

  ctx.fill();


  ctx.beginPath();

  ctx.arc(
    lastX,
    lastY,
    8,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    "rgba(34, 197, 94, 0.3)";

  ctx.stroke();

}


/* =========================================
   CHART RANGE BUTTONS
========================================= */

const rangeButtons =
  document.querySelectorAll(".chart-controls button");


rangeButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    rangeButtons.forEach(function (btn) {

      btn.classList.remove("selected");

    });


    button.classList.add("selected");


    showToast(
      "Chart range changed to " +
      button.textContent
    );

  });

});


/* =========================================
   VIEW ALL BUTTON
========================================= */

const viewAll =
  document.querySelector(".view-all");


if (viewAll) {

  viewAll.addEventListener("click", function () {

    showToast("All orders are displayed in demo mode.");

  });

}


/* =========================================
   WINDOW RESIZE
========================================= */

window.addEventListener("resize", function () {

  drawChart();

});


/* =========================================
   INITIALIZE
========================================= */

updateAsset();

setTradeSide("BUY");

drawChart();
