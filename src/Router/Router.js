const ROUTE_CHANGE_EVENT_NAME = 'ChangeRoute'

export const pushRouter = (onRoute) => {
  window.addEventListener(`${ROUTE_CHANGE_EVENT_NAME}push`, (e) => {
    const { url } = e.detail

    if (url) {
      history.pushState(null, null, url)
      onRoute()
    }
  })

  window.addEventListener(`${ROUTE_CHANGE_EVENT_NAME}replace`, (e) => {
    const { url } = e.detail

    if (url) {
      history.replaceState(null, null, url)
      onRoute()
    }
  })
}

export const makeRouterEvent = (params) => {
  const { url, event } = params
  window.dispatchEvent(new CustomEvent(`${ROUTE_CHANGE_EVENT_NAME}${event}`, {
    detail: {
      url
    }
  }))
}


window.onpopstate = (e) => {
  const { pathname } = window.location
  makeRouterEvent({ url: pathname, event: 'replace' })
}


