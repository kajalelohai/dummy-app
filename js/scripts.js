let state = {
  filter: 'all',
  data: []
};

const setState = (patch) => {
  state = {
    ...state,
    ...patch
  };

  if (state.data && state.data.length) {
    setupStats(state.data);
  }
};

const setupNavbar = () => {
  const navListEl = document.querySelector('.nav-elem-wrap');
  const navItemEls = navListEl.querySelectorAll('.nav-elem');

  navItemEls.forEach((li) => {
    li.addEventListener('click', () => {
      // select the el9ement with active class in navListEl
      let activeItem = navListEl.querySelector('.active');

      // remove active class from activeItem
      activeItem.classList.remove('active');

      // add active class to current item li
      li.classList.add('active');

      const filter = li.dataset.filter;

      setState({ filter });
    });
  });
};

const fetchData = () => {
  const url = 'http://localhost:8000/data/data.json';

  fetch(url)
    .then((res) => res.json())
    .then((data) => setState({ data }));
};

const getDataOfType = (data, type) =>
  data.filter(
    (x) => x.data.main.term_type.toLowerCase() === type.toLowerCase()
  );

const makeStatsNodeMaker = (templateItem) => (
  headingText,
  headingSubText,
  width,
  color
) => {
  const newNode = templateItem.cloneNode(true);

  // setup heading
  const headingNode = newNode.querySelector('h4');

  headingNode.innerText = headingText;

  // setup the sub heading content
  const span = document.createElement('span');
  span.innerText = ` ${headingSubText}`;
  headingNode.appendChild(span);

  // setup the bar
  const bar = newNode.querySelector('.stats-bar-inner');

  bar.style.width = `${width}%`;
  bar.style.background = color;

  return newNode;
};

const setupStats = (data) => {
  const total = data.length;
  const javascript = getDataOfType(data, 'javascript').length;
  const css = getDataOfType(data, 'css').length;
  const html = getDataOfType(data, 'html').length;

  const statsBarContainer = document.getElementById('stats_wrap');
  const templateStatsItem = statsBarContainer.querySelector('.stats-item');
  const newStatsNode = makeStatsNodeMaker(templateStatsItem);

  // setup total stats
  const totalStatsNode = newStatsNode(`TOTAL ITEMS`, `[${total}]`, 100, '#ddd');

  // setup html status
  const htmlStatsNode = newStatsNode(
    `HTML ITEMS`,
    `[${html} of ${total}]`,
    html / total * 100,
    '#86d2f2'
  );

  // setup javascript status
  const javascriptStatsNode = newStatsNode(
    `JAVASCRIPT ITEMS`,
    `[${javascript} of ${total}]`,
    javascript / total * 100,
    '#0dc39d'
  );

  // setup css status
  const cssStatsNode = newStatsNode(
    `CSS ITEMS`,
    `[${css} of ${total}]`,
    css / total * 100,
    '#ff745b'
  );

  const newContainer = statsBarContainer.cloneNode(false);

  newContainer.appendChild(totalStatsNode);
  newContainer.appendChild(htmlStatsNode);
  newContainer.appendChild(javascriptStatsNode);
  newContainer.appendChild(cssStatsNode);

  statsBarContainer.replaceWith(newContainer);
};

setupNavbar();
fetchData();
