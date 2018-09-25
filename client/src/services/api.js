export function getCats (app) {
  const cats = app.service('cats')
  return cats.get().then((cat, err) => cat.cat)
}
