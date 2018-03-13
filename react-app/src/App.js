import React, { Component } from 'react';
import api from 'api-client'
import { BrowserRouter, Route, NavLink, Switch } from 'react-router-dom'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class App extends Component {
  constructor() {
    super()
    this.state = {
      customers:[],
      tickets:[]
    }
  }

  componentDidMount() {
    api.showCustomers().then(res => {
      this.setState({customers:res.data})
    })
    api.showTickets().then(res => {
      this.setState({tickets:res.data})
    })
  }

  render() {
    return (
      <BrowserRouter>
        <PrimaryLayout />
      </BrowserRouter>
    )
  }
}

const PrimaryHeader = () => (
  <ul className="nav nav-tabs mb-4 pt-4 px-4 bg-dark">
    <li className="nav-item mr-1">
      <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/customers">Customers</NavLink>
    </li>
    <li className="nav-item mr-1">
      <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/tickets">Tickets</NavLink>
    </li>
    <li className="nav-item mr-1">
      <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/services">Services</NavLink>
    </li>
    <li className="nav-item mr-1">
      <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/Products">Products</NavLink>
    </li>
  </ul>
)
const PrimaryLayout = () => (
  <div className="primary-layout">
    <PrimaryHeader />
    <main>
      <Switch>
        <Route path="/customers" component={Customers} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/services" component={Services} />
        <Route path="/products" component={Products} />
      </Switch>
    </main>
  </div>
)

class Customers extends Component {
  constructor() {
    super()
    this.state = {
      customers: [],
      responseStatus: ''
    }
  }
  componentDidMount() {
    api.showCustomers().then(res => {
      this.setState({ customers: res.data, responseStatus: res.status })
    })
  }

  render() {
    return (
      <div className="mx-4">
        <div className="table-responsive">
          <table className="text-center table table-striped table-sm table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map(customer => {
                return (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.surname}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <a className="btn btn-sm btn-outline-primary" href="#">More/Edit</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

class Tickets extends Component {
  constructor() {
    super()
    this.state = {
      tickets: [],
      responseStatus: ''
    }
  }
  componentDidMount() {
    api.showTickets().then(res => {
      this.setState({ tickets: res.data, responseStatus: res.status })
    })
  }

  render() {
    return (
      <div className="mx-4">
        <div className="table-responsive">
          <table className="text-center table table-striped table-sm table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Services</th>
                <th>Products</th>
                <th>Total</th>
                <th>Total + tax</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.tickets.map(ticket => {
                let d = new Date(ticket.time.date)
                return (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{d.toLocaleDateString('es-ES', { hour: "2-digit", minute: "2-digit" })}</td>
                    <td>{ticket.idCustomer}</td>
                    <td>service list</td>
                    <td>product list</td>
                    <td>{ticket.total.withoutTax + '€'}</td>
                    <td>{ticket.total.withTax + '€'}</td>
                    <td>
                      <a className="btn btn-sm btn-outline-primary" href="#">More/Edit</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

class Services extends Component {
  constructor() {
    super()
    this.state = {
      services: [],
      responseStatus: ''
    }
  }
  componentDidMount() {
    api.showServices().then(res => {
      this.setState({ services: res.data, responseStatus: res.status })
    })
  }

  render() {
    return (
      <div className="mx-4">
        <div className="table-responsive">
          <table className="text-center table table-striped table-sm table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>tax</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.services.map(service => {
                return (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{service.name}</td>
                    <td>{service.price}</td>
                    <td>{service.tax}</td>
                    <td>
                      <a className="btn btn-sm btn-outline-primary" href="#">More/Edit</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

class Products extends Component {
  constructor() {
    super()
    this.state = {
      products: [],
      responseStatus: ''
    }
  }
  componentDidMount() {
    api.showProducts().then(res => {
      this.setState({ products: res.data, responseStatus: res.status })
    })
  }

  render() {
    return (
      <div className="mx-4">
        <div className="table-responsive">
          <table className="text-center table table-striped table-sm table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>tax</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.products.map(product => {
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.tax}</td>
                    <td>
                      <a className="btn btn-sm btn-outline-primary" href="#">More/Edit</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default App;
