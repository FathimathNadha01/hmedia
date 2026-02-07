


/// popupAdService.js

const getToken = () => localStorage.getItem("access_token");

// ---------------- PUBLIC FETCH (for website popup display) ----------------
export async function fetchPopupAds(baseURL) {
  try {
    const res = await fetch(`${baseURL}/pop-up-ads/`); // public endpoint
    if (!res.ok) throw new Error("Failed to fetch popup ads");
    return await res.json();
  } catch (err) {
    console.error("Popup fetch error:", err);
    return [];
  }
}

// ---------------- ADMIN CREATE ----------------
export async function createPopupAd(baseURL, payload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("page_type", payload.pageType);
  formData.append("link", payload.link || "");
  formData.append("status", payload.status === "Active");

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const res = await fetch(`${baseURL}/admin/pop-up-ads/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Create Popup Ad Error:", text);
    throw new Error("Failed to create popup ad");
  }

  return res.json();
}

// ---------------- ADMIN UPDATE ----------------
export async function updatePopupAd(baseURL, id, payload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("page_type", payload.pageType);
  formData.append("link", payload.link || "");
  formData.append("status", payload.status === "Active");

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const res = await fetch(`${baseURL}/admin/pop-up-ads/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Update Popup Ad Error:", text);
    throw new Error("Failed to update popup ad");
  }

  return res.json();
}

// ---------------- ADMIN DELETE ----------------
export async function deletePopupAd(baseURL, id) {
  const res = await fetch(`${baseURL}/admin/pop-up-ads/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Delete Popup Ad Error:", text);
    throw new Error("Failed to delete popup ad");
  }

  return true;
}
