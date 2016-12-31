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
          <a href="${item.url}">${item.title}</a>
          <span class="flex-row">
            <span class="${cx({green: item.__marked, red: !item.__marked})}">${item.__marked ? 'Marked' : ''}</span>
            <span class="${cx('small-left', {green: !item.__hidden, red: item.__hidden})}">${item.__hidden ? 'Hidden' : 'Shown'}</span>
          </span>
        </div>
        <div class="flex-row">
          <span>${item.id}</span><span>${moment(new Date(item.createdAt)).format('DD MMM YYYY h:mm a')}</span>
        </div>
        <p>${item.selftext.slice(0, 188)}${item.selftext.length > 188 ? '...' : ''}</p>
      </div>`
    )).join('')}
    </div>
  </div>`

);
