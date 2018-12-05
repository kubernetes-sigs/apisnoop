import React from 'react'
import { connect } from 'redux-bundler-react'

import Header from './header'
import Footer from './footer'

export default connect(
  'selectFavoriteMovie',
  'selectNickName',
  'doChangeFavoriteMovie',
  ({ doChangeFavoriteMovie, favoriteMovie, nickName}) => (
      <div id='app'>
      <Header />
      <div class='min-vh-80'>
      <h1>hello, {nickName}</h1>
      <p>Your favorite movie is {favoriteMovie}</p>
      <button
    onClick={() =>
             doChangeFavoriteMovie()
            }
      >Change Fave Movie</button>
      </div>
      <Footer />
      </div>
  )
)
