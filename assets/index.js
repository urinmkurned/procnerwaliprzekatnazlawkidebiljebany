const upload = document.querySelector('.upload');
const loadButton = document.getElementById('loadImage');
const imageUrlInput = document.getElementById('imageUrl');
const previewImage = document.getElementById('previewImage');
const guide = document.querySelector('.guide_holder');
const imageInput = document.createElement('input');

imageInput.type = 'file';
imageInput.accept = '.jpeg,.png,.gif';

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
  localStorage.setItem('userData', JSON.stringify(data));
}

loadButton.addEventListener('click', () => {
  const url = imageUrlInput.value.trim();
  if(url) {
    previewImage.src = url;
    upload.classList.add('upload_loaded');
    upload.setAttribute('selected', url);
    upload.classList.remove('error_shown');
  } else {
    alert('Wklej poprawny link do obrazka!');
  }
});

document.querySelectorAll('.input_holder').forEach((element) => {
  const input = element.querySelector('.input');
  input.addEventListener('click', () => {
    element.classList.remove('error_shown');
  });
});

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
      headers: { Authorization: 'Client-ID 774f3ba80197c47' },
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


guide.addEventListener('click', () => {
  guide.classList.toggle('unfolded');
});


document.querySelector('.go').addEventListener('click', () => {
  const emptyFields = [];
  const data = {};

  if (!upload.hasAttribute('selected')) {
    emptyFields.push(upload);
    upload.classList.add('error_shown');
  } else {
    data['image'] = upload.getAttribute('selected');
  }

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
  } else {

    saveToLocalStorage(data);


    window.location.href = 'id.html';
  }
});


function loadUserData() {
  const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
  for (const key in storedData) {
    const el = document.getElementById(key);
    if (el) {
      el.value = storedData[key];
    }
    if (key === 'image' && document.getElementById('previewImage')) {
      document.getElementById('previewImage').src = storedData[key];
    }
  }
}

window.addEventListener('DOMContentLoaded', loadUserData);
