// netlify/functions/vote-proxy.js
export async function handler(event, context) {
  console.log("📩 Incoming request:", {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body
  });

  if (event.httpMethod === "OPTIONS") {
    console.log("⚙️ Handling CORS preflight");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    console.log("➡️ Forwarding vote payload:", body);

    // 👇 Replace with your Apps Script Web App URL (must end in /exec)
    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyqG2vLRGcmwTxw8iGqXGZ7OAY1729G_lGvWgHwekVFePWxBDb-JxkCU1Py0e-sIIFrmQ/exec";

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await res.text();

    console.log("⬅️ Apps Script raw response status:", res.status, res.statusText);
    console.log("⬅️ Apps Script raw response headers:", [...res.headers]);
    console.log("⬅️ Apps Script raw response body:", text);

    // Try parsing JSON, fallback if it's HTML
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Apps Script did not return JSON:", err);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          status: "error",
          message: "Apps Script returned non-JSON",
          raw: text
        })
      };
    }

    return {
      statusCode: res.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("🔥 Proxy error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
}
