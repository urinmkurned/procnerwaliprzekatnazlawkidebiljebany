var confirmElement = document.querySelector(".confirm");

// ======= OTWIERANIE / ZAMYKANIE STRON =======
function closePage() { clearClassList(); }
function openPage(page) { 
  clearClassList(); 
  confirmElement.classList.add("page_open", "page_" + page + "_open");
}
function clearClassList() {
  confirmElement.classList.remove("page_open", "page_1_open", "page_2_open", "page_3_open");
}

// ======= ZEGAR =======
var time = document.getElementById("time");
var options = { year: 'numeric', month: 'numeric', day: '2-digit' };
var optionsTime = { second: 'numeric', minute: 'numeric', hour: '2-digit' };

if (!localStorage.getItem("update")) localStorage.setItem("update", "21.05.2025");

var date = new Date();
document.querySelector(".bottom_update_value").innerHTML = localStorage.getItem("update");

document.querySelector(".update").addEventListener("click", () => {
  var newDate = new Date().toLocaleDateString("pl-PL", options);
  localStorage.setItem("update", newDate);
  document.querySelector(".bottom_update_value").innerHTML = newDate;
  scroll(0,0);
});

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
function setClock() {
  date = new Date();
  time.innerHTML = "Czas: " + date.toLocaleTimeString("pl-PL", optionsTime) + " " + date.toLocaleDateString("pl-PL", options);
  delay(1000).then(setClock);
}
setClock();

// ======= ROZWIJANE INFO =======
document.querySelector(".info_holder").addEventListener("click", () => {
  document.querySelector(".info_holder").classList.toggle("unfolded");
});

// ======= WCZYTYWANIE DANYCH Z localStorage =======
const fields = [
  "image", "name", "surname", "nationality", "birthday",
  "familyName", "sex", "fathersFamilyName", "mothersFamilyName",
  "birthPlace", "countryOfBirth", "adress1", "adress2", "city", "checkInDate"
];

const data = {};
fields.forEach(f => { data[f] = localStorage.getItem(f) || ""; });

// zdjęcie
if (data.image) document.querySelector(".id_own_image").style.backgroundImage = `url(${data.image})`;

// PESEL
var parts = (data.birthday || "").split(".");
var day = parseInt(parts[0]) || 1;
var month = parseInt(parts[1]) || 1;
var year = parseInt(parts[2]) || 1990;
if (year >= 2000) month += 20;
let later = data.sex?.toLowerCase() === "m" || data.sex?.toLowerCase() === "mężczyzna" ? "0295" : "0382";
if (day < 10) day = "0" + day;
if (month < 10) month = "0" + month;
const pesel = year.toString().substring(2) + month + day + later + "7";
setData("pesel", pesel);

// DATA ZAMELDOWANIA
if (!localStorage.getItem("homeDate")) {
  const homeDay = getRandom(1,25);
  const homeMonth = getRandom(0,12);
  const homeYear = getRandom(2012,2019);
  const homeDate = new Date(homeYear, homeMonth, homeDay);
  localStorage.setItem("homeDate", homeDate.toLocaleDateString("pl-PL", options));
}
setData("home_date", localStorage.getItem("homeDate"));

// WSTAWIANIE DANYCH DO ELEMENTÓW
function setData(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value || "";
}

// konwersja płci
let sexText = data.sex?.toLowerCase();
if (sexText === "m") sexText = "Mężczyzna";
else if (sexText === "k") sexText = "Kobieta";
else sexText = data.sex;

// wypełnienie pól
setData("name", (data.name || "").toUpperCase());
setData("surname", (data.surname || "").toUpperCase());
setData("nationality", (data.nationality || "").toUpperCase());
setData("birthday", data.birthday);
setData("familyName", data.familyName);
setData("sex", sexText);
setData("fathersFamilyName", data.fathersFamilyName);
setData("mothersFamilyName", data.mothersFamilyName);
setData("birthPlace", data.birthPlace);
setData("countryOfBirth", data.countryOfBirth);
setData("adress", `ul. ${data.adress1}<br>${data.adress2} ${data.city}`);

// funkcja losowa
function getRandom(min,max){ return Math.floor(Math.random()*(max-min)+min); }
