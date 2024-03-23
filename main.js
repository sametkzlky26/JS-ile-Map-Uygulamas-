import { detecIcon,setStorage,detecType } from "./helpers.js";

const form = document.querySelector("form");
const list = document.querySelector("ul");
console.log(list);

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

//!ortak kullanım alanları
var map;
var cords = [];
var layerGroup = [];

navigator.geolocation.getCurrentPosition(
  loadMap, console.log("Kullanıcı kabul etmedi")
);

function onMapClick(e) {
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
  /*     console.log(coords);
   */
}

function loadMap(e) {
  map = new L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);

  L.control;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 3,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  layerGroup = L.layerGroup().addTo(map);

  renderNoteList(notes);
  map.on("click", onMapClick);
}

function renderMarker(item) {
  L.marker(item.coords, { icon: detecIcon(item.status) })
    // imleçlerin olduğu katmanı ekler
    .addTo(layerGroup)
    // üzerine tıklanınca açılacak popup yapısını ekleme
    .bindPopup(`${item.desc}`);
}

function handleSubmit(e) {
  e.preventDefault();
  console.log(e);

  const desc = e.target[0].value;
  if (!desc) return;
  const date = e.target[1].value;
  const status = e.target[2].value;

  //notes diziaine eleman ekleme olayı
  notes.push({ id: new Date().getTime(), desc, date, status, coords });
  console.log(notes);
  renderNoteList(notes);
  form.style.display = "none";
}

//notları basma

function renderNoteList(item) {
  list.innerHTML = ""; //notlar alanını temizler
  layerGroup.clearLayers(); //markerları temizle
  item.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.dataset.id = item.id;
    listElement;
    listElement.innerHTML = `
        <div>
            <p>${item.desc}</p>
            <p><span>Tarih:</span>${item.date}</p>
            <p><span>Durum:</span>${detecType(item.status)}</p>

            <i class="bi bi-x" id="delete"></i>
            <i class="bi bi-airplane-fill" id="fly"></i>
        </div>
    `;
    list.insertAdjacentElement("afterbegin", listElement);
    renderMarker(item);
  });
}

function handleClick(e) {
  const id = e.target.parentElement.parentElement.dataset.id;
  if (e.target.id === "delete") {
    console.log(notes);
    notes = notes.filter((note) => note.id != id);

    setStorage(notes); //locali güncelle
    renderNoteList(notes); //ekranı günclle
  }
  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    console.log(note);
    map.flyTo(note.coords);
  }
}
