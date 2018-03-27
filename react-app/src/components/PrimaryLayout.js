import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
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

class PrimaryLayout extends React.Component {
    constructor() {
        super()
        this.state = {
            token: ''
        }
    }
    saveToken = (token) => {
        this.setState({ token })
    }

    render() {
        return (
            <div>
                <PrimaryHeader />
                <Switch>
                    <Route exact path="/" render={props => <Home {...props} saveToken={this.saveToken}/>}/>
                    <Route path="/customers" render={props => (this.state.token ? <Customers {...props} token={this.state.token}/> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/tickets" render={props => (this.state.token ? <Tickets {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/services" render={props => (this.state.token ? <Services {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/products" render={props => (this.state.token ? <Products {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/new/customer" render={props => (this.state.token ? <CreateAndEditCustomer {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/new/ticket" render={props => (this.state.token ? <CreateAndEditTicket {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/new/service" render={props => (this.state.token ? <CreateAndEditService {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/new/product" render={props => (this.state.token ? <CreateAndEditProduct {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/customer/:id" render={props => (this.state.token ? <CreateAndEditCustomer {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/ticket/:id" render={props => (this.state.token ? <CreateAndEditTicket {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/service/:id" render={props => (this.state.token ? <CreateAndEditService {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                    <Route path="/product/:id" render={props => (this.state.token ? <CreateAndEditProduct {...props} token={this.state.token} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)} />
                </Switch>
            </div>
        )
    }
}

export default PrimaryLayout
