
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json({
        error: "Tracking token လိုအပ်ပါသည်။"
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("order_code, product_name, price, status, created_at")
      .eq("tracking_token", token)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Order မတွေ့ပါ။"
      });
    }

    return res.status(200).json({
      success: true,
      order: data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error"
    });
  }
};
