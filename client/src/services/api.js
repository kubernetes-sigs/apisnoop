export function getCats (app) {
console.log('cats requested!')
      const cats = app.service('cats')
      return cats.get().then((cat, err) => cat.cat)
    }
