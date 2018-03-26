import React from 'react'
import api from '../api-config'
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
        observations: ''
    }
    constructor(props) {
        super(props)
        this.state = this.defaultState
    }
    componentDidMount() {
        this.setState({ id: this.props.match.params.id }, function () {
            if (this.state.id) {
                api.showCustomer(this.state.id).then(res => {
                    const { name, surname, phone, email, observations } = res.data
                    this.setState({ name, surname, phone, email, observations })
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
        this.setState({ [query]: input, creation: false })
    }
    delete() {
        api.deleteCustomer(this.state.id).then(() => this.props.history.push('/customers'))
    }
    submit() {
        const { name, surname, phone, email, observations } = this.state
        Promise.resolve().then(() => {
            if (this.state.id) return api.modifyCustomer(name, surname, phone, email, observations, this.state.id)
            this.setState({ creation: true })
            return api.createCustomer(name, surname, phone, email, observations)
        }).then(res => {
            this.setState({ responseStatus: res.status, error: res.error }, function () {
                if (res.status === 'OK') {
                    this.props.history.push('/customer/' + res.data.id)
                }
            })
        })
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
                                    <BSLabeledInput value={this.state.phone} query="phone" read={this.readInput} label="Phone" />
                                </div>
                                <div className="col-sm">
                                    <BSLabeledInput value={this.state.surname} query="surname" read={this.readInput} label="Surname" />
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
                    <div className="col-md">
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateAndEditCustomer
