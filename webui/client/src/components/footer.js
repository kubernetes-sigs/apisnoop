import React from 'react'

export default () => (
    <footer className='absolute bottom-0 w-100 flex flex-column flex-row-ns pt2 pb2 h3 pl4 pr4 items-center justify-between bg-black black shadow-3'>
    <div id='logo' className= 'flex flex-wrap items-center justify-center'>
    <a className='contain bg-cncf bg-center h-100 w4' href='https://cncf.io' title='leads to external cncf homepage'>
    <span className='o-0'>cncf</span>
    </a>
    <a className='contain bg-packet bg-center h-100 w4' href='https://packet.net' title='leads to external packet homepage'>
    <span className='o-0'>packet</span>
    </a>
    <h1 className='ma0 f4 fw4 pl2 avenir'>APISnoop</h1>
    </div>
    <div id='source-code' className='flex items-center'>
    <a href='http://binder.hub.cncf.ci/v2/gh/cncf/apisnoop/master' target='_blank noopener noreferrer' title='external jupyter notebook' className='link f5 pl1 white'>See Data in Jupyter</a>
    </div>
    </footer>
)
