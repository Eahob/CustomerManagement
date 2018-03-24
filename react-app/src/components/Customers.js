import React from 'react'
import InputAutoSubmit from './InputAutoSubmit'
import TableData from './TableData'
import api from '../api-config'

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
                <h1 className="mb-4">Customer List</h1>
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
