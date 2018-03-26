import React from 'react'
import api from '../api-config'
import BSAlert from './BSAlert'
import InputAutoSubmit from './InputAutoSubmit'

class CreateAndEditTicket extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            responseStatus: '',
            error: '',
            creation: false,
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
        this.setState({ id: this.props.match.params.id }, function () {
            if (this.state.id) {
                this.setState({ creation: false })
                api.showTicket(this.state.id).then(res => {
                    this.selectCustomer(res.data.customer._id, res.data.customer.name)
                    res.data.services.forEach(service => {
                        this.selectService(service.service._id, service.service.name, service.price, service.quantity)
                    })
                    res.data.products.forEach(product => {
                        this.selectProduct(product.product._id, product.product.name, product.price, product.quantity)
                    })
                })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id) {
            this.setState({ id: nextProps.match.params.id })
        } else {
            this.setState({
                id: '',
                responseStatus: '',
                error: '',
                creation: false,
                selected: {
                    customer: '',
                    services: [],
                    products: []
                }
            })
        }
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
    selectService = (id, name, price, quantity = 1) => {
        let selected = this.state.selected
        let index = selected.services.findIndex(element => {
            return element.id === id
        })
        if (index < 0) {
            selected.services.push({ id, name, price, quantity })
            this.forceUpdate()
        }
    }
    selectProduct = (id, name, price, quantity = 1) => {
        let selected = this.state.selected
        let index = selected.products.findIndex(element => {
            return element.id === id
        })
        if (index < 0) {
            selected.products.push({ id, name, price, quantity })
            this.forceUpdate()
        }
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
    submit() {
        let customerId = this.state.selected.customer.id
        let selectedServices = this.state.selected.services.map(e => ({ id: e.id, quantity: e.quantity }))
        let selectedProducts = this.state.selected.products.map(e => ({ id: e.id, quantity: e.quantity }))
        Promise.resolve().then(() => {
            if (this.state.id) return api.modifyTicket(customerId, selectedServices, selectedProducts, this.state.id)
            this.setState({ creation: true })
            return api.createTicket(customerId, selectedServices, selectedProducts)
        }).then(res => {
            this.setState({ responseStatus: res.status, error: res.error }, function () {
                if (res.status === 'OK') {
                    this.props.history.push('/ticket/' + res.data.id)
                }
            })
        })
    }
    delete() {
        api.deleteTicket(this.state.id).then(() => this.props.history.push('/tickets'))
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
                <h1 className="mb-4">{this.state.id ? 'Modify ticket' : 'Creating new ticket'}</h1>
                <div className="row">
                    <div className="col">
                        <h4>
                            <span className="text-muted">Customer:</span> {this.state.selected.customer.name}
                        </h4>
                        <h4>
                            <span className="text-muted">Total:</span> <span className="badge badge-primary">{total}€</span>
                        </h4>
                        <BSAlert stt={this.state} alertError={this.state.id ? 'Ticket modification failed' : 'Ticket creation failed'} alertSuccess={this.state.creation ? 'Ticket creation successful' : 'Ticket modification successful'} />
                        <button onClick={() => this.submit()} type="button" className="my-4 btn btn-primary btn-lg btn-block">{this.state.id ? 'Modify' : 'Create'} ticket</button>
                        <h6 className="text-muted">Services <span className="badge badge-secondary">{servicesTotal}€</span></h6>
                        <TicketList data={this.state.selected.services} removeSelected={this.removeSelectedService} modify={this.modifyServiceQuantity} />
                        <br />
                        <h6 className="text-muted">Products <span className="badge badge-secondary">{productsTotal}€</span></h6>
                        <TicketList data={this.state.selected.products} removeSelected={this.removeSelectedProduct} modify={this.modifyProductQuantity} />
                        {this.state.id && <a className="btn btn-danger float-left text-white mt-4" onClick={e => this.delete()}>Delete Ticket</a>}
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readCustomerName} placeholder="Search customer by name" />
                        <FindAndList select={this.selectCustomer} data={this.state.customers} />
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readServiceName} placeholder="Search service by name" />
                        <FindAndList select={this.selectService} data={this.state.services} />
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readProductName} placeholder="Search product by name" />
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
            {props.data.map(elm => <a onClick={e => props.select(elm._id, elm.name, elm.price)} key={keyGenerator()} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">{elm.name} {elm.surname ? elm.surname : ''} {elm.price && <span className="badge badge-info">{elm.price + '€'}</span>}</a>)}
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
