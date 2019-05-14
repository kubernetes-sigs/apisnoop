import React from 'react';
import { connect } from 'redux-bundler-react';
import EndpointListEntry from './endpoint-list-entry';
import { map, orderBy } from 'lodash';

const EndpointsList = ({filteredEndpoints}) => {
  const endpoints = orderBy(filteredEndpoints, ['testHits','level','category','kind'], ['asc', 'desc', 'asc', 'asc'])
  return (
      <section id='endpoints-list'>
      <h2>Endpoints List</h2>
      <p className='i f6'>All endpoints matching your set filters. {Object.keys(endpoints).length} in total.</p>
      <div className="pa4">
        <div className="overflow-auto">
        <table className="f5 w-100 mw8 center" cellSpacing="0">
          <thead>
            <tr>
              <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Endpoint</th>
              <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Tested</th>
              <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Level</th>
              <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Group/Category</th>
              <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Kind</th>
            </tr>
          </thead>
          <tbody className="lh-copy">
            {map(endpoints, endpoint => <EndpointListEntry endpoint={endpoint} key={endpoint.operationId}/>)}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  )
}

export default connect(
  'selectFilteredEndpoints',
  EndpointsList
)
