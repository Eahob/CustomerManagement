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
        <Route path="/services" component={Services} />
        <Route path="/products" component={Products} />
      </Switch>
    </main>
  </div>
)
function InputAutoSubmit(props) {
  return (
    <div className="col-md">
      <input onChange={e => props.read(e.target.value, props.query)} className="form-control" placeholder={props.placeholder} type={props.type} />
    </div>
  )
}
function TableData(props) {
  let counter = 0
  let date = Date.now()
  function keyGenerator() {
    return `${date}${++counter}`
  }
  const tableData = props.callback(props.data)
  return (
    <div className="table-responsive">
      <table className="text-center table table-striped table-sm table-bordered table-hover">
        <thead>
          <tr>
            {props.heads.map(head => <th key={keyGenerator()} >{head}</th>)}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(element => {
            return (
              <tr key={keyGenerator()}>
                {element.map(elm => <td key={keyGenerator()}>{elm}</td>)}
                <td>
                  <a className="btn btn-sm btn-outline-primary" href="#">More/Edit</a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
class Customers extends Component {
  constructor() {
    super()
    this.state = {
      customers: [],
      responseStatus: ''
    }
  }

  setDataTable(arr) {
    let res = []
    arr.forEach(element => {
      res.push([element.name, element.surname, element.phone, element.email])
    })
    return res
  }

  readInput = (input, query) => {
    this.setState({ [query]: input.trim() }, () => this.submit())
  }

  submit() {
    const { name, surname, phone, email, observations } = this.state
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
        <div className="row mb-4">
          <InputAutoSubmit read={this.readInput} query="name" placeholder="Search name" type="text" />
          <InputAutoSubmit read={this.readInput} query="surname" placeholder="Search surname" type="text" />
          <InputAutoSubmit read={this.readInput} query="phone" placeholder="Search phone" type="text" />
          <InputAutoSubmit read={this.readInput} query="email" placeholder="Search email" type="text" />
          <InputAutoSubmit read={this.readInput} query="observations" placeholder="Search observation" type="text" />
        </div>
        <TableData data={this.state.customers} heads={['Name', 'Surname', 'Phone', 'email']} callback={this.setDataTable} />
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

  readInput = (input, query) => {
    this.setState({ [query]: input.trim() }, () => this.submit())
  }

  submit() {
    const { pricemin, pricemax, datemin, datemax } = this.state
    api.showTicketsBy(pricemin, pricemax, datemin, datemax).then(res => {
      this.setState({ tickets: res.data || [], responseStatus: res.status })
    })
  }
  componentDidMount() {
    api.showTicketsBy().then(res => {
      this.setState({ tickets: res.data || [], responseStatus: res.status })
    })
  }

  setDataTable(arr) {
    let res = []
    arr.forEach(element => {
      let d = new Date(element.date)
      res.push([d.toLocaleDateString('es-ES', { hour: "2-digit", minute: "2-digit" }), element.idCustomer, 'service list', 'product list', element.total.withoutTax + '€', element.total.withTax + '€'])
    })
    return res
  }

  render() {
    return (
      <div className="mx-4">
        <div className="row mb-4">
          <InputAutoSubmit read={this.readInput} query="datemin" placeholder="Minimun date" type="date" />
          <InputAutoSubmit read={this.readInput} query="datemax" placeholder="Maximun date" type="date" />
          <InputAutoSubmit read={this.readInput} query="pricemin" placeholder="Minimun total with tax" type="text" />
          <InputAutoSubmit read={this.readInput} query="pricemax" placeholder="Maximun total with tax" type="text" />
        </div>
        <TableData data={this.state.tickets} heads={['Date', 'Customer', 'Services', 'Products', 'Total', 'Total + tax']} callback={this.setDataTable} />
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

  readInput = (input, query) => {
    this.setState({ [query]: input.trim() }, () => this.submit())
  }

  submit() {
    const { pricemin, pricemax, name } = this.state
    api.showServicesBy(pricemin, pricemax, name).then(res => {
      this.setState({ services: res.data || [], responseStatus: res.status })
    })
  }

  componentDidMount() {
    api.showServicesBy().then(res => {
      this.setState({ services: res.data || [], responseStatus: res.status })
    })
  }

  setDataTable(arr) {
    let res = []
    arr.forEach(element => {
      res.push([element.name, element.price + '€', element.tax + ' %'])
    })
    return res
  }

  render() {
    return (
      <div className="mx-4">
        <div className="row mb-4">
          <InputAutoSubmit read={this.readInput} query="name" placeholder="Search service name" type="text" />
          <InputAutoSubmit read={this.readInput} query="pricemin" placeholder="Minimun price" type="number" />
          <InputAutoSubmit read={this.readInput} query="pricemax" placeholder="Maximun price" type="number" />
        </div>
        <TableData data={this.state.services} heads={['Name', 'Price', 'Tax']} callback={this.setDataTable} />
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

  readInput = (input, query) => {
    this.setState({ [query]: input.trim() }, () => this.submit())
  }

  submit() {
    const { pricemin, pricemax, name } = this.state
    api.showProductsBy(pricemin, pricemax, name).then(res => {
      this.setState({ products: res.data || [], responseStatus: res.status })
    })
  }
  componentDidMount() {
    api.showProductsBy().then(res => {
      this.setState({ products: res.data || [], responseStatus: res.status })
    })
  }

  setDataTable(arr) {
    let res = []
    arr.forEach(element => {
      res.push([element.name, element.price + '€', element.tax + ' %'])
    })
    return res
  }

  render() {
    return (
      <div className="mx-4">
        <div className="row mb-4">
          <InputAutoSubmit read={this.readInput} query="name" placeholder="Search product name" type="text" />
          <InputAutoSubmit read={this.readInput} query="pricemin" placeholder="Minimun price" type="number" />
          <InputAutoSubmit read={this.readInput} query="pricemax" placeholder="Maximun price" type="number" />
        </div>
        <TableData data={this.state.products} heads={['Name', 'Price', 'Tax']} callback={this.setDataTable} />
      </div>
    )
  }
}

export default App;
