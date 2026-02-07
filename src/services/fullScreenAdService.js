// fullScreenAdService.js

const getToken = () => localStorage.getItem("access_token");

export async function fetchFullScreenAds(baseURL) {
  try {
    const res = await fetch(`${baseURL}/full-screen-ads/`); // public endpoint
    if (!res.ok) throw new Error("Failed to fetch full screen ads");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createFullScreenAd(baseURL, payload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("page_type", payload.pageType);
  formData.append("link", payload.link || "");
  formData.append("status", payload.status === "Active");

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const res = await fetch(`${baseURL}/admin/full-screen-ads/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Create Full Screen Ad Error:", text);
    throw new Error("Failed to create ad");
  }

  return res.json();
}

export async function updateFullScreenAd(baseURL, id, payload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("page_type", payload.pageType);
  formData.append("link", payload.link || "");
  formData.append("status", payload.status === "Active");

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const res = await fetch(`${baseURL}/admin/full-screen-ads/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Update Full Screen Ad Error:", text);
    throw new Error("Failed to update ad");
  }

  return res.json();
}

export async function deleteFullScreenAd(baseURL, id) {
  const res = await fetch(`${baseURL}/admin/full-screen-ads/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Delete Full Screen Ad Error:", text);
    throw new Error("Failed to delete ad");
  }

  return true;
}
