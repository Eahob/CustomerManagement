import React from 'react';
import InputAutoSubmit from './InputAutoSubmit'
import TableData from './TableData'
import api from 'api-client'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class Tickets extends React.Component {
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
      res.push([[d.toLocaleDateString('es-ES', { hour: "2-digit", minute: "2-digit" }), element.idCustomer, 'service list', 'product list', element.total.withoutTax + '€', element.total.withTax + '€'], element._id])
    })
    return [res, '/ticket/']
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

export default Tickets