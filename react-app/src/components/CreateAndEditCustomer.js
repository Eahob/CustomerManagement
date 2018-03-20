import React from 'react'
import api from 'api-client'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class CreateAndEditCustomer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            responseStatus: '',
            error: '',
            name: '',
            surname: '',
            phone: '',
            email: '',
            observations: ''
        }
    }
    componentDidMount(){
        if (this.state.id) {
            api.showCustomer(this.state.id).then(res => {
                this.setState({})
            })
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({id:nextProps.match.params.id})
    }
    readInput = (input, query) => {
        this.setState({ [query]: input.trim() })
    }
    submit() {
        const { name, surname, phone, email, observations } = this.state
        Promise.resolve().then(() => {
            if (this.state.id) return true//api.modifyCustomer()
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
                <div className="row">
                    <div className="col-md">
                        <form onSubmit={e => {
                            e.preventDefault()
                            this.submit()
                        }} className="mb-3">
                            <div className="row">
                                <div className="col-sm">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input onChange={e => this.readInput(e.target.value, e.target.id)} className="form-control" id="name" placeholder="Customer name" type="text" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input onChange={e => this.readInput(e.target.value, e.target.id)} className="form-control" id="phone" placeholder="Phone number" type="text" />
                                    </div>
                                </div>
                                <div className="col-sm">
                                    <div className="form-group">
                                        <label htmlFor="surname">Surname</label>
                                        <input onChange={e => this.readInput(e.target.value, e.target.id)} className="form-control" id="surname" placeholder="Customer surname" type="text" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">email</label>
                                        <input onChange={e => this.readInput(e.target.value, e.target.id)} className="form-control" id="email" placeholder="name@example.com" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="observations">Observations</label>
                                <textarea onChange={e => this.readInput(e.target.value, e.target.id)} className="form-control" id="observations" rows={3} defaultValue={""} />
                            </div>
                            <div className="clearfix">
                                {/* <button type="button" className="btn btn-danger float-left">Delete</button> */}
                                <button type="submit" className="btn btn-primary float-right">Save</button>
                            </div>
                        </form>
                        <BSAlert stt={this.state} alertError="Customer creation failed" alertSuccess="Customer creation succesful" />
                    </div>
                    <div className="col-md">
                        {this.state.id}
                    </div>
                </div>
            </div>
        )
    }
}

function BSAlert(props) {
    if (!props.stt.responseStatus) {
        return null
    }
    return (
        <div className={' alert alert-' + (props.stt.error ? 'danger' : 'success')} role="alert">
            <h4>{props.stt.error ? props.alertError : props.alertSuccess}</h4>
            {props.stt.error && <p>{props.stt.error}</p>}
        </div>
    )
}

export default CreateAndEditCustomer
