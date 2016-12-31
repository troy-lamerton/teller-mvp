const _ = require('lodash');

module.exports = ({heading, message, dataArray}) => (

  `<h1>Reddit data filtering</h1>
  <h2>Try editing the files to see what changes</h2>
  <div class="content">
    <div>
    ${_.map(dataArray, item => (
      `<div class="data-card">
        <a href="${item.data.url}">${item.data.title}</a>
        <p>${item.data.createdAt}</p>
        <p>${item.data.selftext}</p>
      </div>`
    )).join('')}
    </div>
  </div>`

);
