import React, { useState } from 'react'
import { connect } from 'redux-bundler-react'


const CategoryLegend = ({ categories, colours}) => {
  return (
    <div className='mb0 pb0' >
      <h3 className='f6 pa1 ttsc pb0 mb1'>Second Ring: groups/categories</h3>
      <ul className='list pa1 pl0 pr0 mt0 mb0 pb0'>
        {categories.map(category => {
          let name = category.split('.')[1]
          let colour = colours[category]
          return (
            <li className='pa1 tc white' style={{backgroundColor: colour}} key={name}>{name}</li>
          )
        })
        }
      </ul>
    </div>
  )
}
const Legend = (props) => {
  const {
    levelColours,
    categoryColours
  } = props

  const [seeAll, setSeeAll] = useState(false)

  let levels = Object.keys(levelColours).filter(level => level !== 'unused')
  let categories = Object.keys(categoryColours)

  return (
    <section id='legend'>
      <h2 className='f5'>Legend</h2>
      <h3 className='f6 pa1 ttsc pb0 mb1'>Inner Ring: levels</h3>
      <ul className='list pa1 pl0 pr0 mt0 mb0 pb0'>
        {levels.map(level => {
          return <li className='pa1 tc white' style={{backgroundColor: levelColours[level]}} key={level}>{level}</li>
        })
        }
      </ul>
      {seeAll && <CategoryLegend categories={categories} colours={categoryColours} />}
      {!seeAll && <button className="mt0 pa0 w-100 bg-near-white f6 ttsc tc bn" onClick={() => setSeeAll(true)}>See Full Legend...</button>}
      {seeAll && <button className="mt0 pa0 w-100 bg-near-white f6 ttsc tc bn" onClick={() => setSeeAll(false)}>See Less</button>}
    </section>
  )
}

export default connect(
  'selectLevelColours',
  'selectCategoryColours',
  Legend
)
