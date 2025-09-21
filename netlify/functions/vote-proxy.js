// netlify/functions/vote-proxy.js
export async function handler(event, context) {
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzuHWQAaCbgVHmFOX9345IL03rNUMZGo9luCzwieBIbP2G71x0ariRlL6bWWCSGOYK5hw/exec";

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://caitskinz.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: ""
    };
  }

  try {
    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body,
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://caitskinz.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://caitskinz.github.io",
      },
      body: JSON.stringify({ status: "error", message: err.toString() }),
    };
  }
}
