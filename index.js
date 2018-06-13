export const mapComputed = normalizeNamespace((namespace, states) => {
  const res = {}
  normalizeMap(states).forEach(({ key, val }) => {
    const getValue = (typeof val === 'object' && 'get' in val) ? val['get'] : val;
    const get = function mappedState() {
      let state = this.$store.state
      let getters = this.$store.getters
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof getValue === 'function'
        ? getValue.call(this, state, getters)
        : state[getValue]
    }

    // mark vuex getter for devtools
    get.vuex = true

    if (!(typeof val === 'object' && 'set' in val) && typeof val !== 'string') {
      res[key] = get
    }
    else {
      res[key] = { get: get }
      const setValue = (typeof val === 'string') ? val : val['set']
      res[key].set = function mappedStoreSetter(...args) {
        let context = this.$store
        let commit = this.$store.commit
        if (namespace) {
          const module = getModuleByNamespace(this.$store, 'mapState', namespace);
          if (!module) {
            return
          }
          context = module.context
          commit = module.context.commit
        }

        return typeof setValue === 'function'
          ? setValue.apply(this, [context].concat(args))
          : commit.apply(this.$store, [setValue].concat(args))
      }
    }
  })
  return res
});

function getModuleByNamespace(store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace]
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
  }
  return module
}

function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace(fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}