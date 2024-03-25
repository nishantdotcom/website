import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/+esm';
import Modal from 'bootstrap/js/dist/modal.js';
import blackAutocomplete from '../../blackAutocomplete.js';
import movesMetadataTable from '../../movesMetadataTable.js';
import progressModal from '../../progressModal.js';
import whiteAutocomplete from '../../whiteAutocomplete.js';
import ws from '../../../sanWs.js';
import * as env from '../../../../env.js';

Chart.register(...registerables);

const playersStatsModal = {
  modal: new Modal(document.getElementById('playersStatsModal')),
  form: document.querySelector('#playersStatsModal form')
}

playersStatsModal.form.addEventListener('submit', event => {
  event.preventDefault();
  progressModal.modal.show();
  const formData = new FormData(playersStatsModal.form);
  const playersStatsChart = document.getElementById('playersStatsChart');
  fetch(`${env.API_SCHEME}://${env.API_HOST}:${env.API_PORT}/${env.API_VERSION}/stats/player`, {
    method: 'POST',
    headers: {
      'X-Api-Key': `${env.API_KEY}`
    },
    body: JSON.stringify({
      White: formData.get('White'),
      Black: formData.get('Black'),
      Result: formData.get('Result')
    })
  })
  .then(res => res.json())
  .then(res => {
    new Chart(playersStatsChart, {
      type: 'bar',
      data: {
        labels: res.map(value => value.ECO),
        datasets: [{
          data: res.map(value => value.total)
        }]
      },
      options: {
        animation: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          }
        }
      }
    });
  })
  .catch(error => {
    // TODO
  })
  .finally(() => {
    playersStatsChart.classList.remove('d-none');
    progressModal.modal.hide();
  });
});

export default playersStatsModal;
