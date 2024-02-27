function loading(helper_text = 'Подождите идет загрузка... Это может занять несколько минут!') {
  removeLoading();

  document.querySelector('.items').innerHTML = '';
  wrapper.innerHTML += `
    <divc class="loading">
      <div class="progress-bar">
        <progress value="75" min="0" max="100" style="visibility:hidden;height:0;width:0;">75%</progress>
      </div>
      <br />
      <span class="loading__text"><b>${helper_text}</b></span>
    </divc>
  `;
}

function removeLoading() {
  const progress = wrapper.querySelector('.loading');
  if (progress) wrapper.removeChild(progress);
}
