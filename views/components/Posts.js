const _ = require('lodash');
const cx = require('classnames')
const moment = require('moment')

module.exports = ({posts, markPost}) => (
  _.map(posts, (item, index) => (
    `<div class="data-card" onClick="${() => {console.log(12, markPost); markPost(index)}}">
      <div class="flex-row">
        <a href="${item.url}" class="${cx({highlight: (/testimony/i).test(item.title)})}">${item.title}</a>
        <span class="flex-row">
          <span class="${cx({green: item.__marked, red: !item.__marked})}">${item.__marked ? 'Marked' : ''}</span>
          <span class="${cx('small-left', {green: !item.__hidden, red: item.__hidden})}">${item.__hidden ? 'Hidden' : 'Shown'}</span>
        </span>
      </div>
      <div class="flex-row">
        <span>${item.id}</span><span>${moment(new Date(item.createdAt * 1000)).format('DD MMM YYYY h:mm a')}</span>
      </div>
      <p>${item.selftext.slice(0, 188)}${item.selftext.length > 188 ? '...' : ''}</p>
    </div>`
  )).join('')
)