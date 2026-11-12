
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { order_code, status } = req.body || {};

    const adminId = String(req.body?.admin_id || "");

    if (adminId !== String(process.env.ADMIN_TELEGRAM_ID)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!["Confirmed", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    if (!order_code) {
      return res.status(400).json({ error: "Order ID required" });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("order_code", order_code)
      .eq("status", "Pending")
      .select("order_code, status")
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Pending order not found"
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
