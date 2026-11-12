
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      order_code,
      product_name,
      price,
      mlbb_user_id,
      server_id,
      payment_method
    } = req.body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const adminId = process.env.ADMIN_TELEGRAM_ID;

    if (!token || !adminId) {
      throw new Error("Telegram settings missing");
    }

    const message = [
      "🛒 NEW LEAGUE 2 ORDER",
      "",
      `Order ID: ${order_code}`,
      `Product: ${product_name}`,
      `Price: ${price} Ks`,
      `MLBB ID: ${mlbb_user_id}`,
      `Server ID: ${server_id}`,
      `Payment: ${payment_method}`,
      "",
      "Status: Pending"
    ].join("\n");

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: adminId,
          text: message
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      throw new Error("Telegram notification failed");
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Notification failed"
    });
  }
};
