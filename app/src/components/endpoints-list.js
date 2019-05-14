import React from 'react';
import { connect } from 'redux-bundler-react';
import EndpointListEntry from './endpoint-list-entry';
import { map, orderBy } from 'lodash';

const EndpointsList = ({filteredEndpoints}) => {
  const endpoints = orderBy(filteredEndpoints, ['testHits','level','category','kind'], ['asc', 'desc', 'asc', 'asc'])
  return (
      <section id='endpoints-list'>
      <h2>Endpoints List</h2>
      <p className='i f6'>All endpoints matchingyour set filters. {Object.keys(endpoints).length} in total.</p>
      <div class="pa4">
        <div class="overflow-auto">
        <table class="f6 w-100 mw8 center" cellspacing="0">
          <thead>
            <tr>
              <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Endpoint</th>
              <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Tested</th>
              <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Level</th>
              <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Group/Category</th>
              <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Kind</th>
            </tr>
          </thead>
          <tbody class="lh-copy">
            {map(endpoints, endpoint => <EndpointListEntry endpoint={endpoint} />)}
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
