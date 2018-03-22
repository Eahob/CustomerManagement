import React from 'react'
import api from 'api-client'
import BSAlert from './BSAlert'
import InputAutoSubmit from './InputAutoSubmit'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class CreateAndEditTicket extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: [],
            services: [],
            products: [],
            selected: {
                customer: '',
                services: [],
                products: []
            }
        }
    }
    componentDidMount() {
        Promise.all([
            api.showCustomersBy().then(res => res.data || []),
            api.showServicesBy().then(res => res.data || []),
            api.showProductsBy().then(res => res.data || [])
        ]).then(res => {
            this.setState({ customers: res[0], services: res[1], products: res[2] })
        })
    }
    readCustomerName = (name) => {
        api.showCustomersBy(name).then(res => res.data || []).then(res => {
            this.setState({ customers: res })
        })
    }
    readServiceName = (name) => {
        api.showServicesBy(undefined, undefined, name).then(res => res.data || []).then(res => {
            this.setState({ services: res })
        })
    }
    readProductName = (name) => {
        api.showProductsBy(undefined, undefined, name).then(res => res.data || []).then(res => {
            this.setState({ products: res })
        })
    }
    selectCustomer = (id, name) => {
        let selected = this.state.selected
        selected.customer = { id, name }
        this.forceUpdate()
    }
    selectService = (id, name, price) => {
        let selected = this.state.selected
        let index = selected.services.findIndex(element => {
            return element.id === id
        })
        if (index < 0) {
            selected.services.push({ id, name, price, quantity: 1 })
            this.forceUpdate()
        }
        // else {
        //     selected.services[index].quantity += 1
        // }
    }
    selectProduct = (id, name, price) => {
        let selected = this.state.selected
        let index = selected.products.findIndex(element => {
            return element.id === id
        })
        if (index < 0) {
            selected.products.push({ id, name, price, quantity: 1 })
            this.forceUpdate()
        }
        // else {
        //     selected.products[index].quantity += 1
        // }
    }
    removeSelectedService = (index) => {
        this.state.selected.services.splice(index, 1)
        this.forceUpdate()
    }
    removeSelectedProduct = (index) => {
        this.state.selected.products.splice(index, 1)
        this.forceUpdate()
    }
    modifyProductQuantity = (index, operation) => {
        let quantity = this.state.selected.products[index].quantity
        if (operation) {
            quantity++
        } else if (quantity > 1) {
            quantity--
        }
        this.state.selected.products[index].quantity = quantity
        this.forceUpdate()
    }
    modifyServiceQuantity = (index, operation) => {
        let quantity = this.state.selected.services[index].quantity
        if (operation) {
            quantity++
        } else if (quantity > 1) {
            quantity--
        }
        this.state.selected.services[index].quantity = quantity
        this.forceUpdate()
    }
    render() {
        let reducer = (accum, current) => {
            return accum + current.price * current.quantity
        }
        let servicesTotal = this.state.selected.services.reduce(reducer, 0)
        let productsTotal = this.state.selected.products.reduce(reducer, 0)
        let total = servicesTotal + productsTotal
        return (
            <div className="mx-4">
                <div className="row">
                    <div className="col">
                        <h4>
                            <span className="text-muted">Customer:</span> {this.state.selected.customer.name}
                        </h4>
                        <h4>
                            <span className="text-muted">Total:</span> <span class="badge badge-primary">{total}€</span>
                        </h4>
                        <h6 className="text-muted">Services <span class="badge badge-secondary">{servicesTotal}€</span></h6>
                        <TicketList data={this.state.selected.services} removeSelected={this.removeSelectedService} modify={this.modifyServiceQuantity} />
                        <br />
                        <h6 className="text-muted">Products <span class="badge badge-secondary">{productsTotal}€</span></h6>
                        <TicketList data={this.state.selected.products} removeSelected={this.removeSelectedProduct} modify={this.modifyProductQuantity} />
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readCustomerName} placeholder="Serach customer by name" />
                        <FindAndList select={this.selectCustomer} data={this.state.customers} />
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readServiceName} placeholder="Serach service by name" />
                        <FindAndList select={this.selectService} data={this.state.services} />
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readProductName} placeholder="Serach product by name" />
                        <FindAndList select={this.selectProduct} data={this.state.products} />
                    </div>
                </div>
            </div>
        )
    }
}

function FindAndList(props) {
    let counter = 0
    let date = Date.now()
    function keyGenerator() {
        return `${date}${++counter}`
    }
    return (
        <div className="list-group list-group-flush mt-4">
            {props.data.map(elm => <a onClick={e => props.select(elm._id, elm.name, elm.price)} key={keyGenerator()} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">{elm.name} {elm.surname ? elm.surname : ''} {elm.price && <span className="badge badge-pill badge-info">{elm.price + '€'}</span>}</a>)}
        </div>
    )
}

function TicketList(props) {
    let counter = 0
    let date = Date.now()
    function keyGenerator() {
        return `${date}${++counter}`
    }
    return (
        <ul className="list-group">
            {props.data.map((elm, i) => <li className="list-group-item d-flex justify-content-between align-items-center" key={keyGenerator()}><span className="badge badge-primary">{elm.quantity}</span>{elm.name}<div className="btn-group" role="group"><button type="button" className="btn btn-secondary btn-sm" onClick={e => props.modify(i, true)}>+ </button> <button type="button" className="btn btn-secondary btn-sm" onClick={e => props.modify(i)}>- </button> <button type="button" className="btn btn-danger btn-sm" onClick={e => props.removeSelected(i)}>✖</button></div></li>)}
        </ul>
    )
}

export default CreateAndEditTicket
