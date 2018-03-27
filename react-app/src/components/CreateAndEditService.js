import React from 'react'
import api from '../api-config'
import BSAlert from './BSAlert'
import BSLabeledInput from './BSLabeledInput'

class CreateAndEditService extends React.Component {
    defaultState = {
        id: '',
        responseStatus: '',
        error: '',
        creation: false,
        name: '',
        price: '',
        tax: 21
    }
    constructor(props) {
        super(props)
        this.state = this.defaultState
    }
    componentDidMount() {
        this.setState({ id: this.props.match.params.id }, function () {
            if (this.state.id) {
                api.showService(this.state.id, this.props.token).then(res => {
                    const { name, price, tax } = res.data
                    this.setState({ name, price, tax })
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
    delete() {
        api.deleteService(this.state.id, this.props.token).then(() => this.props.history.push('/services'))
    }
    submit() {
        const { name, price, tax } = this.state
        Promise.resolve().then(() => {
            if (this.state.id) return api.modifyService(name, price, tax, this.state.id, this.props.token)
            this.setState({ creation: true })
            return api.createService(name, price, tax, this.props.token)
        }).then(res => {
            this.setState({ responseStatus: res.status, error: res.error }, function () {
                if (res.status === 'OK') {
                    this.props.history.push('/service/' + res.data.id)
                }
            })
        })
    }
    render() {
        return (
            <div className="mx-4">
                <h1 className="mb-4">{this.state.id ? 'Modify service' : 'Creating new service'}</h1>
                <div className="row">
                    <div className="d-none d-md-block col-4"></div>
                    <div className="col">
                        <form onSubmit={e => {
                            e.preventDefault()
                            this.submit()
                        }} className="mb-3">
                            <BSLabeledInput value={this.state.name} query="name" read={this.readInput} label="Name" />
                            <BSLabeledInput value={this.state.price} query="price" read={this.readInput} label="Price" />
                            <BSLabeledInput value={this.state.tax} query="tax" read={this.readInput} label="Tax" />
                            <div className="clearfix">
                                {this.state.id && <a className="btn btn-danger float-left text-white" onClick={e => this.delete()}>Delete</a>}
                                <button type="submit" className="btn btn-primary float-right">{this.state.id ? 'Save changes' : 'Create'}</button>
                            </div>
                        </form>
                        <BSAlert stt={this.state} alertError={this.state.id ? 'Service modification failed' : 'Service creation failed'} alertSuccess={this.state.creation ? 'Service creation successful' : 'Service modification successful'} />
                    </div>
                    <div className="d-none d-md-block col-4"></div>
                </div>
            </div>
        )
    }
}

export default CreateAndEditService
