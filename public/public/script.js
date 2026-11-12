
const products = {
  diamond: [
    ["86 Diamonds",5800],
    ["172 Diamonds",11000],
    ["257 Diamonds",16300],
    ["343 Diamonds",21800],
    ["429 Diamonds",27000],
    ["514 Diamonds",32500],
    ["600 Diamonds",37600],
    ["706 Diamonds",42900],
    ["878 Diamonds",53600],
    ["964 Diamonds",58900],
    ["1049 Diamonds",64100],
    ["2195 Diamonds",127500]
  ],
  pass: [
    ["Weekly Pass",6900],
    ["Twilight Pass",34500]
  ],
  double: [
    ["2X 50 Diamonds",4100],
    ["2X 150 Diamonds",11500],
    ["2X 250 Diamonds",17200],
    ["2X 500 Diamonds",33700]
  ]
};

let selected = null;

function showProducts(type, button) {
  document.querySelectorAll(".tab").forEach(btn =>
    btn.classList.remove("active")
  );

  button.classList.add("active");
  selected = null;

  const container = document.getElementById("products");
  container.innerHTML = "";

  products[type].forEach(item => {
    const btn = document.createElement("button");
    btn.className = "product";

    btn.innerHTML = `
      <b>${item[0]}</b>
      <div class="price">
        ${item[1].toLocaleString()} Ks
      </div>
    `;

    btn.onclick = () => {
      selected = item;

      document.querySelectorAll(".product").forEach(p =>
        p.classList.remove("selected")
      );

      btn.classList.add("selected");
      updateSummary();
    };

    container.appendChild(btn);
  });

  updateSummary();
}

function updateSummary() {
  document.getElementById("pname").textContent =
    selected ? selected[0] : "မရွေးရသေးပါ";

  document.getElementById("total").textContent =
    selected ? selected[1].toLocaleString() + " Ks" : "0 Ks";
}

function copyText(number) {
  navigator.clipboard.writeText(number)
    .then(() => alert("Copied: " + number))
    .catch(() => alert(number));
}

// Order ကို Backend API ချိတ်ပြီးမှ
// Telegram Admin ဆီ အမှန်တကယ် ပို့နိုင်ပါမယ်။
async function order() {
  const uid = document.getElementById("uid").value.trim();
  const sid = document.getElementById("sid").value.trim();
  const receipt = document.getElementById("receipt").files[0];

  const status = document.getElementById("status");

  if (!selected) {
    status.textContent = "Package ရွေးချယ်ပါ။";
    return;
  }

  if (!uid || !sid) {
    status.textContent = "User ID နှင့် Server ID ဖြည့်ပါ။";
    return;
  }

  if (!receipt) {
    status.textContent = "Payment Screenshot တင်ပေးပါ။";
    return;
  }

  status.textContent =
    "Backend API ချိတ်ဆက်ရန် လိုအပ်ပါသည်။";
}

showProducts("diamond", document.querySelector(".tab"));
