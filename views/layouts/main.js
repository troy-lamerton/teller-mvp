module.exports = ({body, initialState}) => (

  `<!DOCTYPE html>
  <html>
    <head>
      <title>Data filtering tool</title>
      <link rel="stylesheet" href="/styles/main.css" />
    </head>
    <body>
      ${body}
      <script>
        // LiveReload script for development
        document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>')
        // server provides the initial state
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
      </script>
      <script src="/scripts/bundle.js"></script>
    </body>
  </html>`

);
