// Obsługa zdjęcia
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
document.getElementById("uploadBtn").addEventListener("click", () => imageInput.click());
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = e => imagePreview.src = e.target.result;
        reader.readAsDataURL(file);
    }
});

// Walidacja i przekierowanie
document.getElementById("submitBtn").addEventListener("click", function() {
    const fields = [
        "name", "surname", "sex", "nationality", "birthday", "familyName",
        "fathersFamilyName", "mothersFamilyName", "birthPlace", "countryOfBirth",
        "adress1", "adress2", "city", "checkInDate", "image"
    ];

    let valid = true;
    const params = new URLSearchParams();

    fields.forEach(id => {
        const el = document.getElementById(id);
        const error = el.parentElement.querySelector(".error") || (id==="image" ? document.querySelector(".upload .error") : null);
        if(!el.value && id!=="image") { // pola tekstowe
            if(error) error.style.display="block";
            valid=false;
        } else if(id==="image" && !el.files.length){
            if(error) error.style.display="block";
            valid=false;
        } else {
            if(error) error.style.display="none";
            if(id==="image") params.append(id, encodeURIComponent(el.files[0] ? URL.createObjectURL(el.files[0]) : ""));
            else params.append(id, encodeURIComponent(el.value));
        }
    });

    if(valid) window.location.href = "card.html?" + params.toString();
});
