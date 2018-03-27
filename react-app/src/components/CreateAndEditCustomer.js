import React from 'react'
import api from '../api-config'
import InputAutoSubmit from './InputAutoSubmit'
import TableData from './TableData'
import BSAlert from './BSAlert'
import BSLabeledInput from './BSLabeledInput'
import BSLabeledTextarea from './BSLabeledTextarea'

class CreateAndEditCustomer extends React.Component {
    defaultState = {
        id: '',
        responseStatus: '',
        error: '',
        creation: false,
        name: '',
        surname: '',
        phone: '',
        email: '',
        observations: '',
        tickets: [],
        responseStatusTicket: ''
    }
    constructor(props) {
        super(props)
        this.state = this.defaultState
    }
    componentDidMount() {
        this.setState({ id: this.props.match.params.id }, function () {
            if (this.state.id) {
                api.showCustomer(this.state.id, this.props.token).then(res => {
                    const { name, surname, phone, email, observations } = res.data
                    this.setState({ name, surname, phone, email, observations })
                })
                api.showTicketsBy(undefined, undefined, undefined, undefined, this.state.id, this.props.token).then(res => {
                    this.setState({ tickets: res.data || [], responseStatusTicket: res.status })
                })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id) {
            this.setState({ id: nextProps.match.params.id })
        } else {
            this.setState(this.defaultState)
        }
    }
    readInput = (input, query) => {
        this.setState({ [query]: input, creation: false, responseStatus: '' })
    }
    readTableInput = (input, query) => {
        this.setState({ [query]: input.trim() }, () => this.submitTable())
    }
    submitTable() {
        const { pricemin, pricemax, datemin, datemax, id } = this.state
        api.showTicketsBy(pricemin, pricemax, datemin, datemax, id, this.props.token).then(res => {
            this.setState({ tickets: res.data || [], responseStatusTicket: res.status })
        })
    }
    delete() {
        api.deleteCustomer(this.state.id, this.props.token).then(() => this.props.history.push('/customers'))
    }
    submit() {
        const { name, surname, phone, email, observations } = this.state
        Promise.resolve().then(() => {
            if (this.state.id) return api.modifyCustomer(name, surname, phone, email, observations, this.state.id, this.props.token)
            this.setState({ creation: true })
            return api.createCustomer(name, surname, phone, email, observations, this.props.token)
        }).then(res => {
            this.setState({ responseStatus: res.status, error: res.error }, function () {
                if (res.status === 'OK') {
                    this.props.history.push('/customer/' + res.data.id)
                }
            })
        })
    }
    setDataTable(arr) {
        let res = []
        arr.forEach(element => {
            let d = new Date(element.date)
            res.push([[d.toLocaleDateString('es-ES', { hour: "2-digit", minute: "2-digit" }), element.total.withTax + '€'], element._id])
        })
        return [res, '/ticket/']
    }
    render() {
        return (
            <div className="mx-4">
                <h1 className="mb-4">{this.state.id ? 'Modify customer information' : 'Creating new customer'}</h1>
                <div className="row">
                    <div className="col-md">
                        <form onSubmit={e => {
                            e.preventDefault()
                            this.submit()
                        }} className="mb-3">
                            <div className="row">
                                <div className="col-sm">
                                    <BSLabeledInput value={this.state.name} query="name" read={this.readInput} label="Name" />
                                </div>
                                <div className="col-sm">
                                    <BSLabeledInput value={this.state.surname} query="surname" read={this.readInput} label="Surname" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm">
                                    <BSLabeledInput value={this.state.phone} query="phone" read={this.readInput} label="Phone" />
                                </div>
                                <div className="col-sm">
                                    <BSLabeledInput value={this.state.email} query="email" read={this.readInput} label="email" />
                                </div>
                            </div>
                            <BSLabeledTextarea value={this.state.observations} query="observations" read={this.readInput} label="Observations" rows={3} />
                            <div className="clearfix">
                                {this.state.id && <a className="btn btn-danger float-left text-white" onClick={e => this.delete()}>Delete</a>}
                                <button type="submit" className="btn btn-primary float-right">{this.state.id ? 'Save changes' : 'Create'}</button>
                            </div>
                        </form>
                        <BSAlert stt={this.state} alertError={this.state.id ? 'Customer modification failed' : 'Customer creation failed'} alertSuccess={this.state.creation ? 'Customer creation successful' : 'Customer modification successful'} />
                    </div>
                    {this.state.id ?
                        <div className="col-md">
                            <label>Customer history</label>
                            <div className="row mb-3">
                                <InputAutoSubmit read={this.readTableInput} query="datemin" placeholder="Minimun date" type="date" label="From" />
                                <InputAutoSubmit read={this.readTableInput} query="datemax" placeholder="Maximun date" type="date" label="To" />
                            </div>
                            <div className="row mb-3">
                                <InputAutoSubmit read={this.readTableInput} query="pricemin" placeholder="Minimun total" type="text" />
                                <InputAutoSubmit read={this.readTableInput} query="pricemax" placeholder="Maximun total" type="text" />
                            </div>
                            <TableData response={this.state.responseStatusTicket} data={this.state.tickets} heads={['Date', 'Total']} callback={this.setDataTable} />
                        </div>
                        :
                        <div className="col-md"></div>
                    }
                </div>
            </div>
        )
    }
}

export default CreateAndEditCustomer
