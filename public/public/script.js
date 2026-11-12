
const products = {
  diamond: [
    ["86 Diamonds", 5800],
    ["172 Diamonds", 11000],
    ["257 Diamonds", 16300],
    ["343 Diamonds", 21800],
    ["429 Diamonds", 27000],
    ["514 Diamonds", 32500],
    ["600 Diamonds", 37600],
    ["706 Diamonds", 42900],
    ["878 Diamonds", 53600],
    ["964 Diamonds", 58900],
    ["1049 Diamonds", 64100],
    ["2195 Diamonds", 127500]
  ],
  pass: [
    ["Weekly Pass", 6900],
    ["Twilight Pass", 34500]
  ],
  double: [
    ["2X50", 4100],
    ["2X150", 11500],
    ["2X250", 17000],
    ["2X500", 33700]
  ]
};

let selected = null;

function showProducts(type, button) {
  const container = document.getElementById("products");

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  if (button) button.classList.add("active");

  container.innerHTML = "";

  products[type].forEach(([name, price]) => {
    const item = document.createElement("div");
    item.className = "product";
    item.innerHTML = `
      <strong>${name}</strong>
      <p>${price.toLocaleString()} Ks</p>
    `;

    item.addEventListener("click", () => {
      document.querySelectorAll(".product").forEach(p => {
        p.classList.remove("selected");
      });

      item.classList.add("selected");
      selected = { name, price };
      updateSummary();
    });

    container.appendChild(item);
  });
}

function updateSummary() {
  document.getElementById("pname").textContent =
    selected.name;

  document.getElementById("total").textContent =
    selected.price.toLocaleString() + " Ks";
}

async function copyText(number) {
  try {
    await navigator.clipboard.writeText(number);
    alert("Payment Number Copied!");
  } catch {
    alert("Copy မရပါ။ နံပါတ်ကို ကိုယ်တိုင် Copy လုပ်ပါ။");
  }
}

async function order() {
  const uid = document.getElementById("uid").value.trim();
  const sid = document.getElementById("sid").value.trim();
  const payment = document.getElementById("payment-method").value;
  const receipt = document.getElementById("receipt").files[0];
  const status = document.getElementById("status");

  if (!selected) {
    alert("Product တစ်ခုရွေးပါ။");
    return;
  }

  if (!uid || !sid) {
    alert("MLBB User ID နဲ့ Server ID ဖြည့်ပါ။");
    return;
  }

  if (!payment) {
    alert("Payment Method ရွေးပါ။");
    return;
  }

  if (!receipt) {
    alert("ငွေလွှဲ Screenshot တင်ပါ။");
    return;
  }

  if (!receipt.type.startsWith("image/")) {
    alert("Image Screenshot သာ တင်နိုင်ပါသည်။");
    return;
  }

  status.textContent =
    "Order System ချိတ်ဆက်နေဆဲဖြစ်ပါသည်။ နောက်အဆင့်တွင် ပြီးစီးအောင်လုပ်ပါမည်။";
}

showProducts("diamond", document.querySelector(".tab"));
