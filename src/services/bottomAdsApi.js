// bottomAdService.js


export async function fetchBottomAds(baseURL) {
  // No token needed for public GET
  const res = await fetch(`${baseURL}/bottom-banner-ads/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Fetch Bottom Ads Error:", errText);
    throw new Error("Failed to fetch bottom ads");
  }

  return res.json();
}


export async function createBottomAd(baseURL, payload) {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("page_type", payload.pageType);
  formData.append("order", payload.order);
  formData.append("link", payload.link);
  formData.append("status", payload.status === "Active"); // boolean

  if (payload.imageFile) {
    formData.append("image", payload.imageFile); // must be File object
  }

  const res = await fetch(`${baseURL}/admin/bottom-banner-ads/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set 'Content-Type' manually for FormData
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Create Bottom Ad Error:", errText);
    throw new Error("Failed to create bottom ad");
  }

  return res.json();
}

export async function updateBottomAd(baseURL, id, payload) {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("page_type", payload.pageType);
  formData.append("order", payload.order);
  formData.append("link", payload.link);
  formData.append("status", payload.status === "Active");

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const res = await fetch(`${baseURL}/admin/bottom-banner-ads/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Update Bottom Ad Error:", errText);
    throw new Error("Failed to update bottom ad");
  }

  return res.json();
}

export async function deleteBottomAd(baseURL, id) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/bottom-banner-ads/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Delete Bottom Ad Error:", errText);
    throw new Error("Failed to delete bottom ad");
  }

  return true;
}
