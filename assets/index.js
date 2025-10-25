const upload = document.querySelector('.upload');
const imageInput = document.createElement('input');

imageInput.type = 'file';
imageInput.accept = '.jpeg,.png,.gif';

// Remove error class on click
document.querySelectorAll('.input_holder').forEach((element) => {
  const input = element.querySelector('.input');
  input.addEventListener('click', () => {
    element.classList.remove('error_shown');
  });
});

// Upload image
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

// Form submission
document.querySelector('.go').addEventListener('click', () => {
  const emptyFields = [];
  const fields = [
    'name', 'surname', 'sex', 'nationality', 'birthday',
    'familyName', 'fathersFamilyName', 'mothersFamilyName',
    'birthPlace', 'countryOfBirth', 'adress1', 'adress2', 'city', 'checkInDate'
  ];
  const data = {};

  // Check if image uploaded
  if (!upload.hasAttribute('selected')) {
    emptyFields.push(upload);
    upload.classList.add('error_shown');
  } else {
    data['image'] = upload.getAttribute('selected');
  }

  // Collect form values and check empty
  fields.forEach((id) => {
    const input = document.getElementById(id);
    data[id] = input.value;
    if (isEmpty(input.value)) {
      emptyFields.push(input.parentElement);
      input.parentElement.classList.add('error_shown');
    }
  });

  if (emptyFields.length > 0) {
    emptyFields[0].scrollIntoView();
    return;
  }

  // Build query string and redirect
  const params = Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  window.location.href = `card.html?${params}`;
});

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

// Toggle guide
const guide = document.querySelector('.guide_holder');
guide.addEventListener('click', () => {
  guide.classList.toggle('unfolded');
});
