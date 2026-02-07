const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
      return Promise.reject(new Error(message));
    } catch {
      return Promise.reject(new Error(message));
    }
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return handleResponse(res);
}

// CLIMATE
export async function predictClimate(payload) {
  const res = await fetch(`${BASE_URL}/climate/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getClimateZones() {
  const res = await fetch(`${BASE_URL}/climate/zones`);
  return handleResponse(res);
}

// CROPS
export async function recommendCrops(payload) {
  const res = await fetch(`${BASE_URL}/crops/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getAllCrops() {
  const res = await fetch(`${BASE_URL}/crops`);
  return handleResponse(res);
}

// DISEASE
export async function detectDisease({ imageFile, cropName }) {
  const formData = new FormData();
  if (imageFile) {
    formData.append("image", imageFile);
  }
  if (cropName) {
    formData.append("crop_name", cropName);
  }

  const res = await fetch(`${BASE_URL}/disease/detect`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function getAllDiseases() {
  const res = await fetch(`${BASE_URL}/disease`);
  return handleResponse(res);
}

// CHATBOT
export async function chatbotQuery({ message, userId, context }) {
  const res = await fetch(`${BASE_URL}/chatbot/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      user_id: userId,
      context,
    }),
  });

  return handleResponse(res);
}

export async function clearChatHistory(userId) {
  const res = await fetch(`${BASE_URL}/chatbot/history/${userId}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function getChatHistory(userId) {
  const res = await fetch(`${BASE_URL}/chatbot/history/${userId}`);
  return handleResponse(res);
}

