import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxIcm7Z5UmgDdMiBloVAWuVBnxz5FWVak",
  authDomain: "antrian-icu.firebaseapp.com",
  databaseURL: "https://antrian-icu-default-rtdb.firebaseio.com",
  projectId: "antrian-icu",
  storageBucket: "antrian-icu.firebasestorage.app",
  messagingSenderId: "819362863303",
  appId: "1:819362863303:web:21f44fe2652d61784ac6e2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const antrianRef = ref(db, "antrian");

document.getElementById("icuForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    waktu: new Date().toLocaleString(),
    nama: document.getElementById("nama").value,
    diagnosa: document.getElementById("diagnosa").value,
    kegawatan: document.getElementById("kegawatan").value,
    asal: document.getElementById("asal").value,
    keterangan: document.getElementById("keterangan").value,
    adminCode: document.getElementById("adminCode").value
  };

  if (!data.nama || !data.diagnosa || !data.kegawatan || !data.asal) {
    document.getElementById("notif").innerText = "Data wajib diisi!";
    return;
  }

  push(antrianRef, data)
    .then(() => {
      document.getElementById("notif").innerText = "✅ Berhasil mendaftar.";
      document.getElementById("icuForm").reset();
    })
    .catch((err) => {
      document.getElementById("notif").innerText = "❌ Gagal: " + err;
    });
});

// Tampilkan data
onValue(antrianRef, (snapshot) => {
  const tbody = document.querySelector("#antrianTable tbody");
  tbody.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    const key = childSnapshot.key;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.waktu}</td>
      <td>${data.nama}</td>
      <td>${data.diagnosa}</td>
      <td>${data.kegawatan}</td>
      <td>${data.asal}</td>
      <td>${data.keterangan}</td>
      <td>
        ${data.adminCode === "icuadmin" ? `<button onclick="hapusData('${key}')">Hapus</button>` : ""}
      </td>
    `;
    tbody.appendChild(tr);
  });
});

// Fungsi hapus (hanya jika adminCode = 'icuadmin')
window.hapusData = function (id) {
  remove(ref(db, "antrian/" + id));
};
