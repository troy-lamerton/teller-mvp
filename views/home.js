const _ = require('lodash');
const cx = require('classnames')
const moment = require('moment')

module.exports = ({heading, message, posts}) => (

  `<h1>Reddit data filtering</h1>
  <div class="content">
    <div>
    ${_.map(posts, item => (
      `<div class="data-card">
        <div class="flex-row">
          <a href="${item.data.url}">${item.data.title}</a>
          <span class="flex-row">
            <span class="${cx({green: item.__marked, red: !item.__marked})}">${item.__marked ? 'Marked' : ''}</span>
            <span class="${cx('small-left', {green: !item.__hidden, red: item.__hidden})}">${item.__hidden ? 'Hidden' : 'Shown'}</span>
          </span>
        </div>
        <div class="flex-row">
          <span>${item.data.id}</span><span>${moment(item.data.createdAt).format('DD MMM YYYY h:mm a')}</span>
        </div>
        <p>${item.data.selftext.slice(0, 188)}${item.data.selftext.length > 188 ? '...' : ''}</p>
      </div>`
    )).join('')}
    </div>
  </div>`

);
