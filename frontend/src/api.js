// All backend calls live here. Change VITE_API_URL in .env after deploying.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const error = new Error(`Request failed (${response.status})`);
    error.status = response.status;
    try {
      error.data = await response.json();
    } catch {
      /* body was not JSON */
    }
    throw error;
  }
  return response.json();
}

export const getProfile = () => request("/api/profile/");
export const getProjects = () => request("/api/projects/");
export const getProject = (slug) => request(`/api/projects/${slug}/`);

export const sendContact = (payload) =>
  request("/api/contact/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
