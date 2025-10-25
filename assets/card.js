var confirmElement = document.querySelector(".confirm");

function closePage() {
  clearClassList();
}

function openPage(page) {
  clearClassList();
  var classList = confirmElement.classList;
  classList.add("page_open");
  classList.add("page_" + page + "_open");
}

function clearClassList() {
  var classList = confirmElement.classList;
  classList.remove("page_open", "page_1_open", "page_2_open", "page_3_open");
}

// Zegar, update itp. – zostają jak było
var time = document.getElementById("time");
var options = { year: 'numeric', month: 'numeric', day: '2-digit' };
var optionsTime = { second: 'numeric', minute: 'numeric', hour: '2-digit' };

if (localStorage.getItem("update") == null) {
  localStorage.setItem("update", "21.05.2025");
}

var date = new Date();

var updateText = document.querySelector(".bottom_update_value");
updateText.innerHTML = localStorage.getItem("update");

document.querySelector(".update").addEventListener("click", () => {
  var newDate = date.toLocaleDateString("pl-PL", options);
  localStorage.setItem("update", newDate);
  updateText.innerHTML = newDate;
  scroll(0, 0);
});

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

setClock();
function setClock() {
  date = new Date();
  time.innerHTML =
    "Czas: " +
    date.toLocaleTimeString("pl-PL", optionsTime) +
    " " +
    date.toLocaleDateString("pl-PL", options);
  delay(1000).then(() => {
    setClock();
  });
}

var unfold = document.querySelector(".info_holder");
unfold.addEventListener("click", () => {
  unfold.classList.toggle("unfolded");
});

// =================== Wczytanie danych z localStorage ===================
const fields = [
  "image", "name", "surname", "nationality", "birthday",
  "familyName", "sex", "fathersFamilyName", "mothersFamilyName",
  "birthPlace", "countryOfBirth", "adress1", "adress2", "city"
];

const data = {};
fields.forEach((f) => (data[f] = localStorage.getItem(f) || ""));

if (data.image) {
  document.querySelector(".id_own_image").style.backgroundImage = `url(${data.image})`;
}

var birthday = data.birthday;
if (birthday) {
  const parts = birthday.split(".");
  if (parts.length === 3) {
    const d = new Date(parts[2], parts[1] - 1, parts[0]);
    birthday = d.toLocaleDateString("pl-PL", options);
  }
}

var sex = data.sex?.toLowerCase();
if (sex === "m") sex = "Mężczyzna";
else if (sex === "k") sex = "Kobieta";
else sex = data.sex;

// wstaw dane do karty
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
if (localStorage.getItem("homeDate") == null) {
  var homeDay = getRandom(1, 25);
  var homeMonth = getRandom(0, 12);
  var homeYear = getRandom(2012, 2019);

  var homeDate = new Date(homeYear, homeMonth, homeDay);
  localStorage.setItem("homeDate", homeDate.toLocaleDateString("pl-PL", options));
}

document.querySelector(".home_date").innerHTML = localStorage.getItem("homeDate");

// =================== PESEL ===================
const parts = (data.birthday || "").split(".");
let day = parseInt(parts[0]) || 1;
let month = parseInt(parts[1]) || 1;
let year = parseInt(parts[2]) || 1990;

if (year >= 2000) month = 20 + month;

let later = sex === "Mężczyzna" ? "0295" : "0382";
if (day < 10) day = "0" + day;
if (month < 10) month = "0" + month;

const pesel = year.toString().substring(2) + month + day + later + "7";
setData("pesel", pesel);

function setData(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value || "";
}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}
