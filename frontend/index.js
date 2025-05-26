function getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNote() {
    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;
    const id = document.getElementById("note-id").value;

    if (!title || !content) {
        alert("Judul dan isi catatan harus diisi.");
        return;
    }

    const notes = getNotes();

    if (id) {
        const index = notes.findIndex(n => n.id === id);
        notes[index] = {
            id,
            title,
            content
        };
    } else {
        notes.push({
            id: Date.now().toString(),
            title,
            content
        });
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    resetForm();
    renderNotes();
}

function renderNotes() {
    const notes = getNotes();
    const container = document.getElementById("notes-container");
    container.innerHTML = "";

    notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note";
        div.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <div class="actions">
            <button onclick="editNote('${note.id}')">✏️ Edit</button>
            <button onclick="deleteNote('${note.id}')">🗑️ Hapus</button>
          </div>
        `;
        container.appendChild(div);
    });
}

function editNote(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    document.getElementById("note-id").value = note.id;
    document.getElementById("note-title").value = note.title;
    document.getElementById("note-content").value = note.content;
}

function deleteNote(id) {
    if (!confirm("Yakin ingin menghapus catatan ini?")) return;
    let notes = getNotes();
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
}

function resetForm() {
    document.getElementById("note-id").value = "";
    document.getElementById("note-title").value = "";
    document.getElementById("note-content").value = "";
}

renderNotes();

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "index.html";
    } else {
        alert("Username atau password salah.");
    }
}

function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    if (!username || !password) {
        alert("Semua field wajib diisi.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(u => u.username === username);

    if (userExists) {
        alert("Username sudah digunakan.");
        return;
    }

    users.push({
        username,
        password
    });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Pendaftaran berhasil. Silakan login.");
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
