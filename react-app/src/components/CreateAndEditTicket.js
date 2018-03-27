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
            responseStatusCustomers: '',
            services: [],
            responseStatusServices: '',
            products: [],
            responseStatusProducts: '',
            selected: {
                customer: '',
                services: [],
                products: []
            }
        }
    }
    componentDidMount() {
        Promise.all([
            api.showCustomersBy(this.props.token),
            api.showServicesBy(this.props.token),
            api.showProductsBy(this.props.token)
        ]).then(res => {
            this.setState({ customers: res[0].data, responseStatusCustomers: res[0].status, services: res[1].data, responseStatusServices: res[0].status, products: res[2].data,  responseStatusProducts: res[0].status })
        })
        this.setState({ id: this.props.match.params.id }, function () {
            if (this.state.id) {
                this.setState({ creation: false })
                api.showTicket(this.state.id, this.props.token).then(res => {
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
    setFormodify() {
        this.setState({ creation: false, error: '', responseStatus: '' })
    }
    readCustomerName = (name) => {
        api.showCustomersBy(this.props.token, name).then(res => res.data || []).then(res => {
            this.setState({ customers: res })
        })
    }
    readServiceName = (name) => {
        api.showServicesBy(this.props.token, undefined, undefined, name).then(res => res.data || []).then(res => {
            this.setState({ services: res })
        })
    }
    readProductName = (name) => {
        api.showProductsBy(this.props.token, undefined, undefined, name).then(res => res.data || []).then(res => {
            this.setState({ products: res })
        })
    }
    selectCustomer = (id, name) => {
        let selected = this.state.selected
        selected.customer = { id, name }
        this.setFormodify()
        this.setState({ selected })
    }
    selectService = (id, name, price, quantity = 1) => {
        this.setFormodify()
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
        this.setFormodify()
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
        this.setFormodify()
        this.state.selected.services.splice(index, 1)
        this.forceUpdate()
    }
    removeSelectedProduct = (index) => {
        this.setFormodify()
        this.state.selected.products.splice(index, 1)
        this.forceUpdate()
    }
    modifyProductQuantity = (index, operation) => {
        this.setFormodify()
        let selected = this.state.selected
        let quantity = selected.products[index].quantity
        if (operation) {
            quantity++
        } else if (quantity > 1) {
            quantity--
        }
        selected.products[index].quantity = quantity
        this.setState({ selected })
    }
    modifyServiceQuantity = (index, operation) => {
        this.setFormodify()
        let selected = this.state.selected
        let quantity = selected.services[index].quantity
        if (operation) {
            quantity++
        } else if (quantity > 1) {
            quantity--
        }
        selected.services[index].quantity = quantity
        this.setState({ selected })
    }
    submit() {
        let customerId = this.state.selected.customer.id
        let selectedServices = this.state.selected.services.map(e => ({ id: e.id, quantity: e.quantity }))
        let selectedProducts = this.state.selected.products.map(e => ({ id: e.id, quantity: e.quantity }))
        Promise.resolve().then(() => {
            if (this.state.id) return api.modifyTicket(customerId, selectedServices, selectedProducts, this.state.id, this.props.token)
            this.setState({ creation: true })
            return api.createTicket(customerId, selectedServices, selectedProducts, this.props.token)
        }).then(res => {
            this.setState({ responseStatus: res.status, error: res.error }, function () {
                if (res.status === 'OK') {
                    this.props.history.push('/ticket/' + res.data.id)
                }
            })
        })
    }
    delete() {
        api.deleteTicket(this.state.id, this.props.token).then(() => this.props.history.push('/tickets'))
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
                            <span className="text-muted">Total:</span> <span className="badge badge-primary">{total.toFixed(2)}€</span>
                        </h4>
                        <BSAlert stt={this.state} alertError={this.state.id ? 'Ticket modification failed' : 'Ticket creation failed'} alertSuccess={this.state.creation ? 'Ticket creation successful' : 'Ticket modification successful'} />
                        <button onClick={() => this.submit()} type="button" className="my-4 btn btn-primary btn-lg btn-block">{this.state.id ? 'Modify' : 'Create'} ticket</button>
                        <h6 className="text-muted">Services <span className="badge badge-secondary">{servicesTotal.toFixed(2)}€</span></h6>
                        <TicketList data={this.state.selected.services} removeSelected={this.removeSelectedService} modify={this.modifyServiceQuantity} />
                        <br />
                        <h6 className="text-muted">Products <span className="badge badge-secondary">{productsTotal.toFixed(2)}€</span></h6>
                        <TicketList data={this.state.selected.products} removeSelected={this.removeSelectedProduct} modify={this.modifyProductQuantity} />
                        {this.state.id && <a className="btn btn-danger float-left text-white mt-4" onClick={e => this.delete()}>Delete Ticket</a>}
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readCustomerName} placeholder="Search customer by name" />
                        <FindAndList response={this.state.responseStatusCustomers} select={this.selectCustomer} data={this.state.customers} />
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readServiceName} placeholder="Search service by name" />
                        <FindAndList response={this.state.responseStatusServices} select={this.selectService} data={this.state.services} />
                    </div>
                    <div className="col">
                        <InputAutoSubmit read={this.readProductName} placeholder="Search product by name" />
                        <FindAndList response={this.state.responseStatusProducts} select={this.selectProduct} data={this.state.products} />
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
            {props.data.length ?
                props.data.map(elm => <a onClick={e => props.select(elm._id, elm.name, elm.price)} key={keyGenerator()} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">{elm.name} {elm.surname ? elm.surname : ''} {elm.price && <span className="badge badge-info">{elm.price + '€'}</span>}</a>)
            :
                <h5 className="my-4 text-center">{props.response ? 'We found nothing' : 'No response from server'}</h5>
            }
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
