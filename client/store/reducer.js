const _ = require('lodash')
const createStore = require('redux').createStore
const fromJS = require('immutable').fromJS
const cx = require('classnames')
const moment = require('moment')

const initialState = fromJS(window.__INITIAL_STATE__)

function counter(state = initialState, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state.set('count', state.get('count') + 1)
  case 'DECREMENT':
    return state.set('count', state.get('count') - 1)
  default:
    return state
  }
}

const store = createStore(counter)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2

store.subscribe(() => {
  console.log('Current count:', store.getState().toJS().count)
  const posts = store.getState().get('posts').toJS()
  document.querySelector('[store-posts]').innerHTML = (
    _.map(posts, item => (
      `<div class="data-card">
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
})

window.onload = () => {
  document.getElementById('INCREMENT').onclick = () => {
    store.dispatch({ type: 'INCREMENT' })
  }
}

module.exports = store
