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
import Home from './Home'

function PrimaryLayout() {
    return (
        <div>
            <PrimaryHeader />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/customers" component={Customers} />
                <Route path="/tickets" component={Tickets} />
                <Route path="/services" component={Services} />
                <Route path="/products" component={Products} />
                <Route path="/new/customer" component={CreateAndEditCustomer} />
                <Route path="/new/ticket" component={CreateAndEditTicket} />
                <Route path="/new/service" component={CreateAndEditService} />
                <Route path="/new/product" component={CreateAndEditProduct} />
                <Route path="/customer/:id" component={CreateAndEditCustomer} />
                <Route path="/ticket/:id" component={CreateAndEditTicket} />
                <Route path="/service/:id" component={CreateAndEditService} />
                <Route path="/product/:id" component={CreateAndEditProduct} />
            </Switch>
        </div>
    )
}

export default PrimaryLayout
