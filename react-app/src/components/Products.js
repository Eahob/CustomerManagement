import React from 'react'
import { Link } from 'react-router-dom'
import InputAutoSubmit from './InputAutoSubmit'
import TableData from './TableData'
import api from 'api-client'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class Products extends React.Component {
    constructor() {
        super()
        this.state = {
            products: [],
            responseStatus: ''
        }
    }

    readInput = (input, query) => {
        this.setState({ [query]: input.trim() }, () => this.submit())
    }

    submit() {
        const { pricemin, pricemax, name } = this.state
        api.showProductsBy(pricemin, pricemax, name).then(res => {
            this.setState({ products: res.data || [], responseStatus: res.status })
        })
    }
    componentDidMount() {
        api.showProductsBy().then(res => {
            this.setState({ products: res.data || [], responseStatus: res.status })
        })
    }

    setDataTable(arr) {
        let res = []
        arr.forEach(element => {
            res.push([[element.name, element.price + '€', element.tax + ' %'], element._id])
        })
        return [res, '/product/']
    }

    render() {
        return (
            <div className="mx-4">
                <Link to="/product" className="mb-4 btn btn-primary">New Product</Link>
                <div className="row mb-4">
                    <InputAutoSubmit read={this.readInput} query="name" placeholder="Search product name" type="text" />
                    <InputAutoSubmit read={this.readInput} query="pricemin" placeholder="Minimun price" type="number" />
                    <InputAutoSubmit read={this.readInput} query="pricemax" placeholder="Maximun price" type="number" />
                </div>
                <TableData data={this.state.products} heads={['Name', 'Price', 'Tax']} callback={this.setDataTable} />
            </div>
        )
    }
}

export default Products