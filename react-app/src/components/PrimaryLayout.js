import React from 'react';
import { Route, Switch } from 'react-router-dom'
import PrimaryHeader from './PrimaryHeader'
import Customers from './Customers'
import Tickets from './Tickets'
import Services from './Services'
import Products from './Products'
import CreateAndEditCustomer from './CreateAndEditCustomer';

function PrimaryLayout() {
  return (
    <div>
      <PrimaryHeader />
      <main>
        <Switch>
          <Route path="/customers" component={Customers} />
          <Route path="/tickets" component={Tickets} />
          <Route path="/services" component={Services} />
          <Route path="/products" component={Products} />
          <Route exact path="/customer" component={CreateAndEditCustomer} />
          <Route path="/customer/:id" component={CreateAndEditCustomer} />
        </Switch>
      </main>
    </div>
  )
}

export default PrimaryLayout
