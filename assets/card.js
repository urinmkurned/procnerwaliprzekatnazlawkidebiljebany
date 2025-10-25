// =================== Zegar ===================
const timeEl = document.getElementById("time");
const options = { year: 'numeric', month: 'numeric', day: '2-digit' };
const optionsTime = { hour: '2-digit', minute: '2-digit', second: 'numeric' };

function updateClock() {
  const date = new Date();
  timeEl.innerHTML =
    "Czas: " +
    date.toLocaleTimeString("pl-PL", optionsTime) +
    " " +
    date.toLocaleDateString("pl-PL", options);
  setTimeout(updateClock, 1000);
}
updateClock();

// =================== Wczytanie danych ===================
const urlParams = new URLSearchParams(window.location.search);

const fields = [
  "image", "name", "surname", "nationality", "birthday",
  "familyName", "sex", "fathersFamilyName", "mothersFamilyName",
  "birthPlace", "countryOfBirth", "adress1", "adress2", "city", "checkInDate"
];

const data = {};
fields.forEach(f => {
  data[f] = urlParams.get(f) || localStorage.getItem(f) || "";
});

// =================== Wstawienie danych ===================
function setData(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value || "";
}

// obrazek
if (data.image) {
  document.querySelector(".id_own_image").style.backgroundImage = `url(${data.image})`;
}

// przetworzenie daty urodzenia
let birthday = data.birthday;
if (birthday) {
  const parts = birthday.split(".");
  if (parts.length === 3) {
    const d = new Date(parts[2], parts[1]-1, parts[0]);
    birthday = d.toLocaleDateString("pl-PL", options);
  }
}

// przetworzenie płci
let sex = data.sex?.toLowerCase();
if (sex === "m") sex = "Mężczyzna";
else if (sex === "k") sex = "Kobieta";
else sex = data.sex;

// wstawienie danych
setData("name", (data.name || "").toUpperCase());
setData("surname", (data.surname || "").toUpperCase());
setData("nationality", (data.nationality || "").toUpperCase());
setData("birthday", birthday);
setData("familyName", data.familyName);
setData("sex", sex);
setData("fathersFamilyName", data.fathersFamilyName);
setData("mothersFamilyName", data.mothersFamilyName);
setData("birthPlace", data.birthPlace);
setData("countryOfBirth", data.countryOfBirth);
setData("adress", `ul. ${data.adress1}<br>${data.adress2} ${data.city}`);

// =================== Losowa data zameldowania ===================
if (!localStorage.getItem("homeDate")) {
  const homeDay = getRandom(1, 25);
  const homeMonth = getRandom(0, 12);
  const homeYear = getRandom(2012, 2019);
  const homeDate = new Date(homeYear, homeMonth, homeDay);
  localStorage.setItem("homeDate", homeDate.toLocaleDateString("pl-PL", options));
}
document.querySelector(".home_date").innerHTML = localStorage.getItem("homeDate");

// =================== PESEL ===================
const birthdayParts = (data.birthday || "").split(".");
let day = parseInt(birthdayParts[0]) || 1;
let month = parseInt(birthdayParts[1]) || 1;
let year = parseInt(birthdayParts[2]) || 1990;

if (year >= 2000) month = 20 + month;

const later = sex === "Mężczyzna" ? "0295" : "0382";
if (day < 10) day = "0" + day;
if (month < 10) month = "0" + month;

const pesel = year.toString().substring(2) + month + day + later + "7";
setData("pesel", pesel);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// =================== Aktualizacja daty ===================
const updateText = document.querySelector(".bottom_update_value");
if (!localStorage.getItem("update")) localStorage.setItem("update", "21.05.2025");
updateText.innerHTML = localStorage.getItem("update");

document.querySelector(".update").addEventListener("click", () => {
  const date = new Date();
  const newDate = date.toLocaleDateString("pl-PL", options);
  localStorage.setItem("update", newDate);
  updateText.innerHTML = newDate;
  scroll(0, 0);
});

// =================== Rozwijane info ===================
document.querySelector(".info_holder").addEventListener("click", () => {
  document.querySelector(".info_holder").classList.toggle("unfolded");
});
