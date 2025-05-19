const backendURL = 'http://localhost:3000';

function uploadCSV() {
  const fileInput = document.getElementById('csvFile');
  const formData = new FormData();
  formData.append('csvFile', fileInput.files[0]);

  fetch(`${backendURL}/upload`, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('message').innerText = data.message || data.error;
  })
  .catch(err => {
    document.getElementById('message').innerText = '❌ Upload failed: ' + err.message;
  });
}

function searchData() {
  const params = new URLSearchParams({
    symbol: document.getElementById('symbol').value,
    dateFrom: document.getElementById('dateFrom').value,
    dateTo: document.getElementById('dateTo').value,
    timeFrom: document.getElementById('timeFrom').value,
    timeTo: document.getElementById('timeTo').value,
  });

  fetch(`${backendURL}/search?` + params.toString())
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('results');
      tbody.innerHTML = '';
      data.forEach(row => {
        tbody.innerHTML += `
          <tr>
            <td>${row.symbol}</td><td>${row.date}</td><td>${row.time}</td>
            <td>${row.open}</td><td>${row.high}</td><td>${row.low}</td>
            <td>${row.close}</td><td>${row.volume}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      document.getElementById('message').innerText = '❌ Search failed: ' + err.message;
    });
}
