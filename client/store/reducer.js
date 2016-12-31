const _ = require('lodash')
const createStore = require('redux').createStore
const fromJS = require('immutable').fromJS
const cx = require('classnames')

const Posts = require('../../views/components/Posts')

const initialState = fromJS(window.__INITIAL_STATE__)
const types = require('./types')

function counter(state = initialState, action) {
  switch (action.type) {
  case types.INCREMENT:
    return state.set('count', state.get('count') + 1)
  case types.MARK_POST:
    return state.setIn(['posts', action.index, '__marked'], true)
  case types.UNMARK_POST:
    return state.setIn(['posts', action.index, '__marked'], false)
  case types.HIDE_POST:
    return state.setIn(['posts', action.index, '__hidden'], true)
  case types.UNHIDE_POST:
    return state.setIn(['posts', action.index, '__hidden'], false)
  default:
    return state
  }
}

const store = createStore(counter)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.dispatch({ type: types.INCREMENT })
// 1

store.subscribe(() => {
  console.log('Current count:', store.getState().toJS().count)
  const posts = store.getState().get('posts').toJS()
  function markPost (index) {
    store.dispatch()
  }
  document.querySelector('[store-posts]').innerHTML = Posts({posts, markPost})
})

window.onload = () => {
  document.getElementById('INCREMENT').onclick = () => {
    store.dispatch({ type: types.INCREMENT })
  }
  const postsList = document.querySelector('[store-posts]')
  postsList.childNodes.forEach((postNode, index) => {
    const newPostNode = postNode.cloneNode(true)
    newPostNode.onclick = () => {
      console.log('clicky')
      store.dispatch({ type: types.MARK_POST, index: index})
    }
    postsList.replaceChild(newPostNode, postNode);
  })
}

module.exports = store
