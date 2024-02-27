const wrapper = document.querySelector('.wrapper');


const API = 'https://api.valantis.store:41000/';
const ENDPOINTS = {
  ids: 'get_ids',
  items: 'get_items',
  fields: 'get_fields',
  filter: 'filter',
};
const PASSWORD = 'Valantis';
// выводить по 50 товаров на страницу
const PAGE_SIZE = 50;


async function requester(body = {}) {
  const password = getMD5Password();

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'X-Auth': 'password',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
  
    return result;
  } catch (error) {
    console.error(error);
    return requester(body);
  }
}

async function getItems(offset = 0) {
  const ids_body = {
    "action": ENDPOINTS.ids,
    "params": { offset, "limit": PAGE_SIZE }
  };
  const ids = await requester(ids_body);

  const items_body = {
    "action": ENDPOINTS.items,
    "params": { "ids": ids.result },
  };
  const items = await requester(items_body);
  
  // Если API возвращает дубли по id, то следует их считать одним товаром и выводить только первый, даже если другие поля различаются.
  const results = [...new Set(items.result.map(JSON.stringify))].map(JSON.parse);

  return results;
}

function renderItems(items) {
  const HTMLItems = items.map((item) => `
    <li class="items__item">
      <span><b>ID</b>: ${item.id}</span>
      <span><b>Название</b>: ${item.product}</span>
      <span><b>Цена</b>: ${item.price}</span>
      <span><b>Брэнд</b>: <b>${item.brand || '-'}</b></span>
    </li>
  `).join('');

  const itemsNode = document.querySelector('.items');
  itemsNode.innerHTML = HTMLItems;
}

function getMD5Password() {
  const DATE = new Date().toLocaleDateString('ru', { timeZone: 'Europe/Moscow' }).split('.').reverse().join('');
  const result = CryptoJS.MD5(`${PASSWORD}_${DATE}`);

  return result;
}

async function main() {
  loading();
  const all_ids = await requester({ "action": ENDPOINTS.ids });

  const items = await getItems();
  removeLoading();

  renderItems(items);
  renderPagination(1, Math.ceil(all_ids.result.length / PAGE_SIZE));
}

main();
