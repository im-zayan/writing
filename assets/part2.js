// Part 2: the before/after slider. Data: assets/part2-data.json (five messages x five model stages, with glosses).
(() => {
  const root = document.getElementById('p2-ex');
  if (!root) return;
  const base = document.currentScript ? new URL('.', document.currentScript.src) : new URL('assets/', location.href);
  const esc = t => (t || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const ST = ['shipped', 'synthetic', 'flashthought', 'thaanafirst', 'flash'];
  const WHO = ['Gemma 4, as shipped', '+ synthetic chat', '+ Flash-style thoughts', '+ Thaana first', 'Gemini 3.7 Flash'];
  const ORDER = ['football', 'school', 'quake', 'gold', 'date'];
  const LBL = { football: 'Football', school: 'School', quake: 'Earthquake (typo)', gold: 'Gold price', date: "Today's date" };
  const V = { YES: 'understood', PARTIAL: 'got the gist', NO: 'missed' };
  const TH = /[ހ-޿]/g;
  let D, cur = 'football', si = 0;
  const thought = t => esc(t).split('\n').filter(x => x.trim()).slice(0, 3)
    .map(x => x.replace(/([ހ-޿][ހ-޿\s،؟.]*)/g, '<span class="t">$1</span>')).join('\n');
  function step() {
    const m = D[cur], s = ST[si], r = m[s];
    root.querySelector('input').value = si;
    root.querySelectorAll('.p2-ticks span').forEach((x, i) => x.classList.toggle('on', i === si));
    const dv = (r.reply.match(TH) || []).length > (r.reply.match(/[A-Za-z]/g) || []).length;
    const col = s === 'flash' ? '#3b5f92' : s === 'thaanafirst' ? 'var(--green)' : 'var(--muted)';
    root.querySelector('.p2-body').innerHTML = `<div class="p2-user">${esc(m.latin)}</div><div class="p2-user-en">${esc(m.en_user)}</div>
      <div class="p2-who" style="color:${col}">${WHO[si]} · ${V[r.v] || ''}</div>
      ${r.thought && (s === 'thaanafirst' || s === 'flashthought') ? `<div class="p2-scratch">${thought(r.thought)}</div>` : ''}
      <div class="p2-reply ${dv ? 'rtl' : 'lat'}" ${dv ? 'lang="dv"' : ''}>${esc(r.reply)}</div>${r.reply.length > 260 ? '<button class="p2-more" type="button">show all</button>' : ''}
      <div class="p2-gloss">“${esc(r.en || '')}”</div>`;
    const b = root.querySelector('.p2-more');
    if (b) b.addEventListener('click', () => { const x = root.querySelector('.p2-reply'); x.classList.toggle('open'); b.textContent = x.classList.contains('open') ? 'show less' : 'show all'; });
  }
  fetch(new URL('part2-data.json', base)).then(r => r.json()).then(data => {
    D = data;
    const msgs = root.querySelector('.p2-msgs');
    msgs.innerHTML = ORDER.map(k => `<button class="p2-chip" type="button" data-k="${k}" aria-pressed="${k === cur}">${LBL[k]}</button>`).join('');
    msgs.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { cur = b.dataset.k; msgs.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); step(); }));
    root.querySelector('input').addEventListener('input', e => { si = +e.target.value; step(); });
    root.querySelectorAll('.p2-ticks span').forEach((x, i) => x.addEventListener('click', () => { si = i; step(); }));
    step();
    // read-more: every reply, thought and judge trace, rendered on first open
    const raw = document.getElementById('p2-raw');
    if (!raw) return;
    raw.addEventListener('toggle', () => {
      if (!raw.open || raw.dataset.done) return;
      raw.dataset.done = 1;
      fetch(new URL('part2-raw.json', base)).then(r => r.json()).then(R => {
        const pre = (t, dv) => `<pre${dv ? ' class="dv" lang="dv"' : ''}>${esc(t)}</pre>`;
        const isDv = t => (t.match(TH) || []).length > (t.match(/[A-Za-z]/g) || []).length;
        raw.querySelector('.p2-raw-body').innerHTML = ORDER.map(k => {
          const m = D[k], j = R[k];
          return `<details class="p2-raw-msg"><summary>${LBL[k]} · <code>${esc(m.latin)}</code></summary>
            <div class="k">Thaana (meaning key)</div>${pre(m.thaana, true)}
            <div class="k">English</div>${pre(m.en_user)}
            ${ST.map((s, i) => {
              const r = m[s];
              return `<h4>${WHO[i]} <span>· astra: ${V[r.v]} · luna: ${V[r.luna]}</span></h4>
                ${r.thought ? `<div class="k">Thinking</div>${pre(r.thought)}` : ''}
                <div class="k">Reply</div>${pre(r.reply, isDv(r.reply))}
                <div class="k">English</div>${pre(r.en || '')}
                <div class="k">Astra's reason</div>${pre(r.astra.why)}`;
            }).join('')}
            <h4>Judge prompt <span>· replies shuffled, models unnamed: ${j.order.map(s => WHO[ST.indexOf(s)]).join(' / ')}</span></h4>${pre(j.prompt)}
            <h4>Astra's raw output</h4>${pre(j.output)}
          </details>`;
        }).join('');
      });
    });
  });
})();
