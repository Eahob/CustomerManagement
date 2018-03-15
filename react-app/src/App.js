import React, { Component } from 'react';
import api from 'api-client'
import { BrowserRouter, Route, NavLink, Switch } from 'react-router-dom'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class App extends Component {
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
        {/* <Route path="/services" component={Services} />
        <Route path="/products" component={Products} /> */}
      </Switch>
    </main>
  </div>
)
function InputAutoSubmit(props) {
  return (
    <div className="col-md">
      <input onChange={e => this.keepInput(e.target.value, e.target.name)} name="name" className="form-control" placeholder="name" type="text" />
    </div>
  )
}
class Customers extends Component {
  constructor() {
    super()
    this.state = {
      customers: [],
      responseStatus: '',
      form: {
        name: '',
        surname: '',
        phone: '',
        observations: ''
      }
    }
  }
  keepInput(input, property) {
    this.setState(prevState => {
      let form = prevState.form
      form[property] = input.trim()
      return { form }
    }, function () {
      this.submit()
    })
  }
  submit() {
    const { name, surname, phone, email, observations } = this.state.form
    api.showCustomersBy(name, surname, phone, email, observations).then(res => {
      this.setState({ customers: res.data || [], responseStatus: res.status })
    })
  }
  componentDidMount() {
    api.showCustomersBy().then(res => {
      this.setState({ customers: res.data || [], responseStatus: res.status })
    })
  }

  render() {
    return (
      <div className="mx-4">
        <form className="mb-4" onSubmit={e => { e.preventDefault(); this.submit() }}>
          <div className="row">
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} name="name" className="form-control" placeholder="name" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} name="surname" className="form-control" placeholder="surname" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} name="phone" className="form-control" placeholder="phone" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} name="observations" className="form-control" placeholder="observations" type="text" />
            </div>
            <div className="col-md">
              <button type="submit" className="btn btn-outline-secondary col">Search</button>
            </div>
          </div>
        </form>

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
              {this.state.customers.map((customer, index) => {
                return (
                  <tr key={customer._id}>
                    <td>{index}</td>
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
      responseStatus: '',
      form: {
        pricemin: '',
        pricemax: '',
        datemin: '',
        datemax: ''
      }
    }
  }
  keepInput(input, property) {
    this.setState(prevState => {
      let form = prevState.form
      form[property] = input.trim()
      return { form }
    })
  }
  submit() {
    const { pricemin, pricemax, datemin, datemax } = this.state.form
    api.showTicketsBy(pricemin, pricemax, datemin, datemax).then(res => {
      this.setState({ tickets: res.data, responseStatus: res.status })
    })
  }
  componentDidMount() {
    api.showTicketsBy().then(res => {
      this.setState({ tickets: res.data, responseStatus: res.status })
    })
  }

  render() {
    return (
      <div className="mx-4">
        <form className="mb-4" onSubmit={e => { e.preventDefault(); this.submit() }}>
          <div className="row">
            {/* <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="service" className="form-control" placeholder="service" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="product" className="form-control" placeholder="product" type="text" />
            </div> */}
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="datemin" className="form-control" placeholder="Minimun date" type="date" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="datemax" className="form-control" placeholder="Maximun date" type="date" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="pricemin" className="form-control" placeholder="Minimun total with tax" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="pricemax" className="form-control" placeholder="Maximun total with tax" type="text" />
            </div>
            <div className="col-md">
              <button type="submit" className="btn btn-outline-secondary col">Search</button>
            </div>
          </div>
        </form>
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
                let d = new Date(ticket.date)
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
      responseStatus: '',
      form: {
        name: '',
        pricemin: '',
        pricemax: ''
      }
    }
  }

  keepInput(input, property) {
    this.setState(prevState => {
      let form = prevState.form
      form[property] = input.trim()
      return { form }
    })
  }
  submit() {
    const { pricemin, pricemax, name } = this.state.form
    api.showServicesBy(pricemin, pricemax, name).then(res => {
      this.setState({ services: res.data, responseStatus: res.status })
    })
  }

  componentDidMount() {
    api.showServicesBy().then(res => {
      this.setState({ services: res.data, responseStatus: res.status })
    })
  }

  render() {
    return (
      <div className="mx-4">
        <form className="mb-4" onSubmit={e => { e.preventDefault(); this.submit() }}>
          <div className="row">
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="name" className="form-control" placeholder="name" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="pricemin" className="form-control" placeholder="Minimun price" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="pricemax" className="form-control" placeholder="Maximun price" type="text" />
            </div>
            <div className="col-md">
              <button type="submit" className="btn btn-outline-secondary col">Search</button>
            </div>
          </div>
        </form>
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
                    <td>#</td>
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
      responseStatus: '',
      form: {
        name: '',
        pricemin: '',
        pricemax: ''
      }
    }
  }
  keepInput(input, property) {
    this.setState(prevState => {
      let form = prevState.form
      form[property] = input.trim()
      return { form }
    })
  }
  submit() {
    function serialize(obj) {
      //https://stackoverflow.com/a/1714899
      let str = [];
      for (let p in obj)
        if (obj.hasOwnProperty(p) && obj[p]) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    }
    api.showProducts(serialize(this.state.form)).then(res => {
      this.setState({ products: res.data, responseStatus: res.status })
    })
  }
  // componentDidMount() {
  //   // api.showProducts().then(res => {
  //   //   this.setState({ products: res.data, responseStatus: res.status })
  //   // })
  // }

  render() {
    return (
      <div className="mx-4">
        <form className="mb-4" onSubmit={e => { e.preventDefault(); this.submit() }}>
          <div className="row">
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="name" className="form-control" placeholder="name" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="pricemin" className="form-control" placeholder="Minimun price" type="text" />
            </div>
            <div className="col-md">
              <input onChange={e => this.keepInput(e.target.value, e.target.name)} value={this.state.name} name="pricemax" className="form-control" placeholder="Maximun price" type="text" />
            </div>
            <div className="col-md">
              <button type="submit" className="btn btn-outline-secondary col">Search</button>
            </div>
          </div>
        </form>
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
