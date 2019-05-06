import React from 'react'

export default () => (
    <footer className='w-100 flex flex-row-ns pt2 pb2 h3 pl4 pr4 items-center justify-between bg-black black shadow-3 white'>
    <div id='logo' className= 'flex flex-wrap items-center justify-center'>
    <a className='contain bg-cncf bg-center white h-100 w4 mr4' href='https://cncf.io' title='leads to external cncf homepage'>
    <span className='o-0'>cncf</span>
    </a>
    <a className='contain bg-packet bg-center h-100 w4 mr4' href='https://packet.net' title='leads to external packet homepage'>
    <span className='o-0'>packet</span>
    </a>
    </div>
    <div id='source-code' className='flex items-center'>
    </div>
    </footer>
)
