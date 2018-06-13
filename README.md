# vuex-computed

Adds mapComputed for easier get/setable computed properties

### Example

```
import { mapComputed } from 'vuex-computed';

const store = new Vuex.Store( {
  state: {
    count: 0,
    data: 'someData'
  },
  mutations: {
    count(state, count) {
      state.count = count;
    },
    data(state, data) {
      state.data = data;
    }
  }
};

const vm = new Vue({
  store,
  computed: {
    ...mapComputed(['count', 'data']),
    /// --- OR ---
    ...mapComputed({
      count: 'count',
      data: 'data'
    }),
    /// --- OR ---
    ...mapComputed({
      count: (state) => state.count,
      data: (state) => state.data
    })
    /// --- OR ---
    ...mapComputed({
      count: {
        get: (state) => state.count,
        set: ({ commit }, count) => commit('count', count)
      }  
    })  
  }
})

```

### Installing

```
npm install vuex-computed
```