// src/api/userProfileApi.js

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
};

// Fetch user profile data from the backend
export const fetchProfile = async () => {
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE_URL}/profile`, { headers });
  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized access");
    throw new Error("Failed to fetch profile");
  }
  const result = await response.json();
  return result.data;
};

//Fetch other's profile data
export const fetchPublicProfileById = async ({userId}) => {
  const token = localStorage.getItem("token");
  console.log(userId)
  console.log(`${API_BASE_URL}/profile/${userId}`);
  const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include auth token if required
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("User not found");
    throw new Error("Failed to fetch public profile");
    
  }

  const result = await response.json();
  return result.data;
};




// Add new skills to the user's profile
export const addSkills = async (newSkills) => {
  const queryParams = new URLSearchParams();
  newSkills.forEach(skill => queryParams.append("skills", skill));

  const response = await fetch(`${API_BASE_URL}/add-skills?${queryParams.toString()}`, {
    method: "POST",
    headers,
  });
  if (!response.ok) throw new Error("Failed to add skills");
  return await response.json();
};

// Remove a specific skill from the user's profile
export const removeSkill = async (skillToRemove) => {
  const response = await fetch(`${API_BASE_URL}/remove-skill/?skill=${encodeURIComponent(skillToRemove)}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error("Failed to remove skill");
  return await response.json();
};

// Add a new affiliation to the user's profile
export const addAffiliation = async (newAffiliation) => {
  if (!newAffiliation.affiliation || !newAffiliation.role) {
    throw new Error("Invalid affiliation format");
  }
  const queryParams = new URLSearchParams();
  queryParams.append("affiliations", newAffiliation.affiliation);
  queryParams.append("roles", newAffiliation.role);

  const response = await fetch(`${API_BASE_URL}/add-affiliations?${queryParams.toString()}`, {
    method: "POST",
    headers,
  });
  if (!response.ok) throw new Error("Failed to add affiliation");
  return await response.json();
};

// Remove a specific affiliation from the user's profile
export const removeAffiliation = async (affiliationToRemove) => {
  const affiliationName = affiliationToRemove.affiliation || affiliationToRemove;
  const response = await fetch(`${API_BASE_URL}/remove-affiliation/?affiliation=${encodeURIComponent(affiliationName)}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error("Failed to remove affiliation");
  return await response.json();
};

// Add a new scholarship to the user's profile
export const addScholarship = async (newScholarship) => {
  const queryParams = new URLSearchParams();
  queryParams.append("scholarships", newScholarship);

  const response = await fetch(`${API_BASE_URL}/add-scholarships?${queryParams.toString()}`, {
    method: "POST",
    headers,
  });
  if (!response.ok) throw new Error("Failed to add scholarship");
  return await response.json();
};

// Remove a specific scholarship from the user's profile
export const removeScholarship = async (scholarshipToRemove) => {
  const response = await fetch(`${API_BASE_URL}/remove-scholarship/?scholarship=${encodeURIComponent(scholarshipToRemove)}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error("Failed to remove scholarship");
  return await response.json();
};

export const updateLinks = async ({ facebook, linkedin, github }) => {
  const formData = new FormData();
  formData.append("facebook", facebook);
  formData.append("linkedin", linkedin);
  formData.append("github", github);

  const response = await fetch(`${API_BASE_URL}/update-links`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, // Don't include Content-Type for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.detail || "Failed to update social links");
  }

  return await response.json();
};