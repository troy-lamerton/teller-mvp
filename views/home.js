const Posts = require('./components/Posts') 

module.exports = ({heading, message, posts}) => (

  `<h1 id="INCREMENT">Reddit data filtering</h1>
  <div class="content">
    <div store-posts>${Posts({posts})}
    </div>
  </div>`

);
