import React from 'react'
import { Link } from 'react-router-dom'
import InputAutoSubmit from './InputAutoSubmit'
import TableData from './TableData'
import api from '../api-config'

class Services extends React.Component {
    constructor() {
        super()
        this.state = {
            services: [],
            responseStatus: ''
        }
    }

    readInput = (input, query) => {
        this.setState({ [query]: input.trim() }, () => this.submit())
    }

    submit() {
        const { pricemin, pricemax, name } = this.state
        api.showServicesBy(pricemin, pricemax, name).then(res => {
            this.setState({ services: res.data || [], responseStatus: res.status })
        })
    }

    componentDidMount() {
        api.showServicesBy().then(res => {
            this.setState({ services: res.data || [], responseStatus: res.status })
        })
    }

    setDataTable(arr) {
        let res = []
        arr.forEach(element => {
            res.push([[element.name, element.price + '€', element.tax + ' %'], element._id])
        })
        return [res, '/service/']
    }

    render() {
        return (
            <div className="mx-4">
                <Link to="/service" className="mb-4 btn btn-primary">New Service</Link>
                <div className="row mb-4">
                    <InputAutoSubmit read={this.readInput} query="name" placeholder="Search service name" type="text" />
                    <InputAutoSubmit read={this.readInput} query="pricemin" placeholder="Minimun price" type="number" />
                    <InputAutoSubmit read={this.readInput} query="pricemax" placeholder="Maximun price" type="number" />
                </div>
                <TableData data={this.state.services} heads={['Name', 'Price', 'Tax']} callback={this.setDataTable} />
            </div>
        )
    }
}

export default Services
