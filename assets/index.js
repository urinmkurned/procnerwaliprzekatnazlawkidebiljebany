const upload = document.querySelector('.upload');
const imageInput = document.createElement('input');

imageInput.type = 'file';
imageInput.accept = '.jpeg,.png,.gif';

// Reset error po kliknięciu w input
document.querySelectorAll('.input_holder').forEach((element) => {
  const input = element.querySelector('.input');
  input.addEventListener('click', () => element.classList.remove('error_shown'));
});

// Upload obrazka
upload.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', async () => {
  resetUploadState();

  const file = imageInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: 'Client-ID 774f3ba80197c47',
      },
      body: formData,
    });

    const result = await response.json();

    if (result?.data?.link) {
      updateUploadState(result.data.link);
    } else {
      showErrorState();
    }
  } catch {
    showErrorState();
  }
});

// Kliknięcie "Go" – walidacja i zapis
document.querySelector('.go').addEventListener('click', () => {
  const emptyFields = [];
  const data = {};

  // obrazek
  if (!upload.hasAttribute('selected')) {
    emptyFields.push(upload);
    upload.classList.add('error_shown');
  } else {
    data['image'] = upload.getAttribute('selected');
  }

  // pola tekstowe
  document.querySelectorAll('.input_holder').forEach((element) => {
    const input = element.querySelector('.input');
    data[input.id] = input.value;

    if (isEmpty(input.value)) {
      emptyFields.push(element);
      element.classList.add('error_shown');
    }
  });

  if (emptyFields.length > 0) {
    emptyFields[0].scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // zapis do localStorage
  saveToLocalStorage(data);

  // przekierowanie z parametrami w URL
  const params = Object.keys(data)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

  window.location.href = `card.html?${params}`;
});

// funkcje pomocnicze
function isEmpty(value) {
  return /^\s*$/.test(value);
}

function resetUploadState() {
  upload.classList.remove('upload_loaded', 'upload_loading', 'error_shown');
  upload.removeAttribute('selected');
}

function updateUploadState(url) {
  upload.classList.add('upload_loaded');
  upload.setAttribute('selected', url);
  upload.querySelector('.upload_uploaded').src = url;
}

function showErrorState() {
  upload.classList.add('error_shown');
}

function saveToLocalStorage(data) {
  for (const key in data) {
    localStorage.setItem(key, data[key]);
  }
}

// przewijane info
const guide = document.querySelector('.guide_holder');
guide.addEventListener('click', () => guide.classList.toggle('unfolded'));
