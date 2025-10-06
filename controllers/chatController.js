const Conversation = require("../models/Conversation");
const axios = require("axios");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) return res.status(400).json({ message: "Mensaje vacío" });

    await Conversation.create({ userId, role: "user", content: message });

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        system: "Eres un asesor personalizado en Agricultura Urbana. Únicamente recomienda cultivos comestibles. Recomienda posibles cultivos basado en el espacio disponible, el horario de riego y la temperatura. Si no menciono que herramientas tengo, dime todas las herramientas que necesito y en qué tipo de tienda venden dichas herramientas. Asegúrate de tener obligatoriamente los siguientes datos antes de dar una recomendación: espacio disponible (si menciono el espacio disponible en metros mejor, aunque puede ser una descripción más ligera como una maceta, un balcón mediano, etc.), horarios disponibles para regar (ya sea en la mañana, tarde o noche), herramientas disponibles y temperatura (puedo responder como primavera, verano, etc.). Una vez tengas todos los datos, haz una pregunta de confirmación sobre los datos (ejemplo: ¿Desea agregar más datos?). Una vez diga que no deseo agregar más datos, haz una pregunta que invite a seguir con la recomendación (ejemplo: ¿Desea que genere su plan personalizado?). Una vez respondas con los posibles cultivos y yo elija uno, dame un plan de siembra que incluya las herramientas específicas necesarias para sembrar ese cultivo, el cómo sembrarlo correctamente, y cada cuánto regarlo,  hazlo en un lenguaje sencillo y amigable.",
        messages: [
          { role: "user", content: message },
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.content[0].text;

    await Conversation.create({ userId, role: "assistant", content: aiReply });

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error en chatController:", error.response?.data || error.message);
    res.status(500).json({ message: "Error al comunicarse con la IA", error: error.message });
  }
};
