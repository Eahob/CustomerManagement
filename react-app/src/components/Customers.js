import React from 'react';
import { Link } from 'react-router-dom'
import InputAutoSubmit from './InputAutoSubmit'
import TableData from './TableData'
import api from 'api-client'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class Customers extends React.Component {
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
            res.push([[element.name, element.surname, element.phone, element.email], element._id])
        })
        return [res, '/customer/']
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
                <Link to="/customer" className="mb-4 btn btn-primary">New Customer</Link>
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

export default Customers