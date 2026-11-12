
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRODUCTS = {
  "Weekly Pass": 6900,
  "Twilight Pass": 34500,
  "86 Diamonds": 5800,
  "172 Diamonds": 11000,
  "257 Diamonds": 16300,
  "343 Diamonds": 21800,
  "429 Diamonds": 27000,
  "514 Diamonds": 32500,
  "600 Diamonds": 37600,
  "706 Diamonds": 42900,
  "878 Diamonds": 53600,
  "964 Diamonds": 58900,
  "1049 Diamonds": 64100,
  "2195 Diamonds": 127500,
  "2X50": 4100,
  "2X150": 11500,
  "2X250": 17000,
  "2X500": 33700
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      product_name,
      mlbb_user_id,
      server_id,
      payment_method
    } = req.body || {};

    if (
      !product_name ||
      !mlbb_user_id ||
      !server_id ||
      !payment_method
    ) {
      return res.status(400).json({
        error: "အချက်အလက်အားလုံး ဖြည့်ပါ။"
      });
    }

    if (!PRODUCTS[product_name]) {
      return res.status(400).json({
        error: "Product မမှန်ပါ။"
      });
    }

    if (!["KPay", "WavePay"].includes(payment_method)) {
      return res.status(400).json({
        error: "Payment method မမှန်ပါ။"
      });
    }

    const orderCode = "L2-" + Date.now();
    const trackingToken = require("crypto")
      .randomBytes(24).toString("hex");

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        tracking_token: trackingToken,
        product_name,
        price: PRODUCTS[product_name],
        mlbb_user_id: String(mlbb_user_id),
        server_id: String(server_id),
        payment_method
      })
      .select("order_code, tracking_token, status")
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      order: data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Order တင်ရာတွင် ပြဿနာရှိနေပါသည်။"
    });
  }
};

