// Progressive enhancement: all four cases and their raw continuations are HTML.
const chapter = document.querySelector('#part25');
if (chapter) {
  const picker = chapter.querySelector('#p25-opening');
  const cases = [...chapter.querySelectorAll('[data-p25-case]')];
  if (picker && cases.length) {
    const select = () => {
      for (const item of cases) {
        item.hidden = item.dataset.p25Case !== picker.value;
        item.open = !item.hidden;
      }
    };
    chapter.setAttribute('data-enhanced', '');
    picker.addEventListener('change', select);
    select();
  }
}
