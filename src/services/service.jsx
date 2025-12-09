import { api } from "../App";

export const fetchFunction = async () => {
  const response = await fetch(`${api}/sciences/`);
  if (!response.ok) {
    throw new Error("Fanlar ma'lumotini yuklashda xatolik yuz berdi.");
  }
  return await response.json();
};

export const addFunction = async (scienceData) => {
  const response = await fetch(`${api}/sciences/`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify(scienceData),
  });
  if (!response.ok) {
    console.log(response.statusText);
    throw new Error("Fan qo'shishda xatolik yuz berdi.");
  }
  return await response.json();
};

export const deleteFunction = async (scienceId) => {
  const response = await fetch(`${api}/sciences/${scienceId}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Fan o'chirishda xatolik yuz berdi.");
  }
};

export const updateFunction = async (id, data) => {
  const access = localStorage.getItem("accessToken");

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("difficulty", data.difficulty);
  formData.append("img", data.img);

  const response = await fetch(`${api}/sciences/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update science");
  }

  return await response.json();
};
