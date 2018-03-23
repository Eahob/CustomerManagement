import React from 'react'
import api from '../api-config'
import BSAlert from './BSAlert'
import BSLabeledInput from './BSLabeledInput'

class CreateAndEditProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            responseStatus: '',
            error: '',
            creation: false,
            name: '',
            price: '',
            tax: 21
        }
    }
    componentDidMount() {
        this.setState({ id: this.props.match.params.id }, function () {
            if (this.state.id) {
                api.showProduct(this.state.id).then(res => {
                    const { name, price, tax } = res.data
                    this.setState({ name, price, tax })
                })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ id: nextProps.match.params.id })
    }
    readInput = (input, query) => {
        this.setState({ [query]: input, creation: false })
    }
    delete() {
        api.deleteProduct(this.state.id).then(()=> this.props.history.push('/products'))
    }
    submit() {
        const { name, price, tax } = this.state
        Promise.resolve().then(() => {
            if (this.state.id) return api.modifyProduct(name, price, tax, this.state.id)
            this.setState({ creation: true })
            return api.createProduct(name, price, tax)
        }).then(res => {
            this.setState({ responseStatus: res.status, error: res.error }, function () {
                if (res.status === 'OK') {
                    this.props.history.push('/product/' + res.data.id)
                }
            })
        })
    }
    render() {
        return (
            <div className="mx-4">
                <div className="row">
                    <div className="col-md-4">
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
                        <BSAlert stt={this.state} alertError={this.state.id ? 'Product modification failed' : 'Product creation failed'} alertSuccess={this.state.creation ? 'Product creation successful' : 'Product modification successful'} />
                    </div>
                    <div className="d-lg-none col-sm-4"></div>
                    <div className="d-xl-none col-sm-4"></div>
                </div>
            </div>
        )
    }
}

export default CreateAndEditProduct

