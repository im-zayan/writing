(() => {
  const data = JSON.parse(document.getElementById('p27-patch-data').textContent);
  const donor = document.getElementById('p27-donor');
  const variant = document.getElementById('p27-variant');
  const layer = document.getElementById('p27-layer');
  function render() {
    const row = data[donor.value].variants[variant.value][Number(layer.value) - 1];
    document.getElementById('p27-layer-value').textContent = layer.value;
    document.getElementById('p27-token').textContent = row.top;
    const margin = row.fish_logp - row.month_logp;
    document.getElementById('p27-readout').textContent = `Fish minus month log-probability: ${margin > 0 ? '+' : ''}${margin.toFixed(2)} nats. Positive favors fish over month; negative favors month. Another word can outrank both.`;
  }
  donor.addEventListener('change', render);
  variant.addEventListener('change', render);
  layer.addEventListener('input', render);
  render();
})();
