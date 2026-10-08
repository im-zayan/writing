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

  // The exported diagram measures its sandboxed inner frame. Match the outer
  // frame to that document so mobile readers scroll the article, not a box.
  const scorer = chapter.querySelector('#p25-scorer-frame');
  if (scorer) {
    scorer.addEventListener('load', () => {
      const body = scorer.contentDocument?.body;
      if (!body) return;
      const resize = () => {
        const height = Math.ceil(body.getBoundingClientRect().height);
        if (height > 0 && height <= 12000 && scorer.style.height !== `${height}px`) {
          scorer.style.height = `${height}px`;
        }
      };
      const observer = new ResizeObserver(resize);
      observer.observe(body);
      resize();
      window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
    });
  }
}
