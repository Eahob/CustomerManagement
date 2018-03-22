import React from 'react';
import { Route, Switch } from 'react-router-dom'
import PrimaryHeader from './PrimaryHeader'
import Customers from './Customers'
import Tickets from './Tickets'
import Services from './Services'
import Products from './Products'
import CreateAndEditCustomer from './CreateAndEditCustomer'
import CreateAndEditTicket from './CreateAndEditTicket'
import CreateAndEditService from './CreateAndEditService'
import CreateAndEditProduct from './CreateAndEditProduct'

function PrimaryLayout() {
  return (
    <div>
      <PrimaryHeader />
      <Switch>
        <Route path="/customers" component={Customers} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/services" component={Services} />
        <Route path="/products" component={Products} />
        <Route exact path="/customer" component={CreateAndEditCustomer} />
        <Route path="/customer/:id" component={CreateAndEditCustomer} />
        <Route exact path="/ticket" component={CreateAndEditTicket} />
        <Route path="/ticket/:id" component={CreateAndEditTicket} />
        <Route exact path="/service" component={CreateAndEditService} />
        <Route path="/service/:id" component={CreateAndEditService} />
        <Route exact path="/product" component={CreateAndEditProduct} />
        <Route path="/product/:id" component={CreateAndEditProduct} />
      </Switch>
    </div>
  )
}

export default PrimaryLayout
