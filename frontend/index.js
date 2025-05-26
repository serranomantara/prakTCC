const API_URL = "https://be-427042664362.us-central1.run.app";

function getToken() {
  return localStorage.getItem("token");
}

async function getNotes() {
  try {
    const res = await fetch(`${API_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Gagal mengambil catatan:", error);
    return [];
  }
}

async function saveNote() {
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;
  const id = document.getElementById("note-id").value;

  if (!title || !content) {
    alert("Judul dan isi catatan harus diisi.");
    return;
  }

  const method = id ? "PUT" : "POST";
  const endpoint = id ? `${API_URL}/notes/${id}` : `${API_URL}/notes`;

  try {
    await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, content })
    });
    resetForm();
    renderNotes();
  } catch (error) {
    console.error("Gagal menyimpan catatan:", error);
  }
}

async function renderNotes() {
  const notes = await getNotes();
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="actions">
        <button onclick="editNote('${note.id}', '${note.title}', \`${note.content}\`)">✏️ Edit</button>
        <button onclick="deleteNote('${note.id}')">🗑️ Hapus</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function editNote(id, title, content) {
  document.getElementById("note-id").value = id;
  document.getElementById("note-title").value = title;
  document.getElementById("note-content").value = content;
}

async function deleteNote(id) {
  if (!confirm("Yakin ingin menghapus catatan ini?")) return;

  try {
    await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    renderNotes();
  } catch (error) {
    console.error("Gagal menghapus catatan:", error);
  }
}

function resetForm() {
  document.getElementById("note-id").value = "";
  document.getElementById("note-title").value = "";
  document.getElementById("note-content").value = "";
}

async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Username atau password salah.");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.accessToken);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login gagal:", error);
  }
}

async function register() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  if (!username || !password) {
    alert("Semua field wajib diisi.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Registrasi gagal.");
      return;
    }

    alert("Pendaftaran berhasil. Silakan login.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Registrasi gagal:", error);
  }
}

if (window.location.pathname.includes("index.html")) {
  document.addEventListener("DOMContentLoaded", renderNotes);
}
