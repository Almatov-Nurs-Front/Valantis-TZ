const helpers = {
  product: 'Поиск по названию...',
  price: 'Поиск по цене...',
  brand: 'Поиск по бренду...',
};

document.addEventListener('DOMContentLoaded', function() {
  const filter = document.getElementById('filter');
  const search = document.getElementById('search');
  const submit = document.getElementById('submit');
  const form = document.getElementById('search-form');

  filter.addEventListener('change', function({ target: { value } }) {
    search.hidden = !value;
    search.placeholder = helpers[ value ] || '';

    submit.hidden = !value;

    if (value) {
      form.addEventListener('submit', async function(event) {
        event.preventDefault();
        loading('Идет поиск... Подождите!');
        removePagination();
        const search = event.target[0].value;
        
        const filter_body = {
          "action": "filter",
          "params": {[value]: search},
        };
        const filter = await requester(filter_body);

        const items_body = {
            "action": ENDPOINTS.items,
            "params": { "ids": filter.result },
          };
          
        const items = await requester(items_body);
        const results = [...new Set(items.result.map(JSON.stringify))].map(JSON.parse);
        removeLoading();

        renderItems(results);
      });
    } else {
      removePagination();
      main();
    }
  });
});
