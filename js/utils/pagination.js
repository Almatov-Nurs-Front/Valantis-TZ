function handleChangePage({ id, textContent }, count) {
  let page;
  const currentPage = document.querySelector('.current_page');

  if (id === 'next') {
    page = parseInt(currentPage.textContent) + 1;
  } else if (id === 'prev') {
    page = parseInt(currentPage.textContent) - 1;
  } else {
    page = parseInt(textContent);
  }
  updateItems(page);
  renderPagination(page, count);
}

async function updateItems(offset) {
  loading();

  const items = await getItems((offset - 1) * PAGE_SIZE);
  removeLoading();

  renderItems(items);
}

function renderPagination(page, count) {
  const p = document.querySelector('.pagination');

  let btns = [];

  if (count <= 7) {
    btns = Array.from({ count }, (_, i) => i + 1);
  } else {
    if(page < 5) {
      btns = [ 1, 2, 3, 4, 5, null, count ];
    } else if (page > count - 4) {
      btns = [ 1, null, count - 4, count - 3, count - 2, count - 1, count ];
    } else {
      btns = [ 1, null, page - 1, page, page + 1, null, count ];
    }
  }

  const click = `onclick="handleChangePage(this, ${count})"`;
  const buttons = [
    `<li><button id="prev" ${page === 1 ? 'disabled' : ''} ${click}><</button></li>`,
    ...btns.map((n) => `<li><button class="${n === page ? 'current_page ' : ''}page-${n}" ${!n || n === page ? 'disabled' : ''} ${click}>${n || '...'}</button></li>`),
    `<li><button id="next" ${page === count ? 'disabled' : ''} ${click}>></button></li>`,
  ];
  p.innerHTML = buttons.join('');
}

function removePagination() {
  const p = document.querySelector('.pagination');
  p.innerHTML = '';
}
