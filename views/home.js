const _ = require('lodash');
const cx = require('classnames')

module.exports = ({heading, message, dataArray}) => (

  `<h1>Reddit data filtering</h1>
  <div class="content">
    <div>
    ${_.map(dataArray, item => (
      `<div class="data-card">
        <div class="flex-row">
          <a href="${item.data.url}">${item.data.title}</a>
          <span class="flex-row">
            <span class="${cx({green: item.__marked, red: !item.__marked})}">${item.__marked ? 'Marked' : ''}</span>
            <span class="${cx('small-left', {green: !item.__hidden, red: item.__hidden})}">${item.__hidden ? 'Hidden' : 'Shown'}</span>
          </span>
        </div>
        <div class="flex-row">
          <span>${item.data.id}</span><span>${item.data.createdAt}</span>
        </div>
        <p>${item.data.selftext}</p>
      </div>`
    )).join('')}
    </div>
  </div>`

);
