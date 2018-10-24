import React, { Component } from 'react'

class Dropdown extends Component {
  constructor (props) {
    super(props)
    this.optionsList = this.optionsList.bind(this)
    this.selectEnter = this.selectEnter.bind(this)
  }

  selectEnter (dom) {
  }

  optionsList = (options) => {
    return options.map(option => {
      return(
          <li className='ph1 bb bb--dotted b--light-silver bg-white bt-0'>
          <a href={option}
        role='menuitem'
        className='filter-choice w-100 db h2 flex items-center'
          >
          {option}
        </a>
          </li>
      )
    })
  }


  render () {
      return (
          <div className='pa4 f6'>
          <a className="section">{this.props.context}</a>
          <div id='datasets' className='h3 section w-40' >
          <div id='selection-box' role='menubar' aria-haspopup='true'
        className='relative f4 ph1 dib h2 black z-max flex items-center'>
          <span id='select-title'
        className='db tc'
        onMouseEnter={(e) => this.selectEnter(e)}>
           {this.props.options[0]}</span>


          <ul id='sel-option' role='menu' aria-hidden='true'
              className=' z-max absolute top2 w-100 pl0 ml0 list center mw6 ba b--dotted bt-0'>
        </ul>
          </div>
          </div>
          </div>
      )
  }
}

export default Dropdown
