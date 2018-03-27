import React from 'react'
import { NavLink } from 'react-router-dom'

function PrimaryHeader() {
    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
                <div className="navbar-collapse collapse order-1 order-md-0 dual-collapse2">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink exact className="btn btn-dark nav-link mr-1" activeClassName="active" to="/">#</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="btn btn-dark nav-link mr-1" activeClassName="active" to="/customers">Customers</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="btn btn-dark nav-link mr-1" activeClassName="active" to="/new/customer">New Customer</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="btn btn-dark nav-link mr-1" activeClassName="active" to="/tickets">Tickets</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="btn btn-dark nav-link" activeClassName="active" to="/new/ticket">New Ticket</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="mr-auto order-0">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                        <span className="navbar-toggler-icon" />
                    </button>
                </div>
                <div className="navbar-collapse collapse order-3 dual-collapse2">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown">
                            <button type="button" className="btn btn-dark nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Services</button>
                            <div className="dropdown-menu dropdown-menu-right text-right">
                                <NavLink className="dropdown-item" to="/services">Services List</NavLink>
                                <NavLink className="dropdown-item" to="/new/service">New Service</NavLink>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <button type="button" className="btn btn-dark nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Products</button>
                            <div className="dropdown-menu dropdown-menu-right text-right">
                                <NavLink className="dropdown-item" to="/products">Products List</NavLink>
                                <NavLink className="dropdown-item" to="/new/product">New Product</NavLink>
                            </div>
                        </li>

                    </ul>
                </div>
            </nav>

        </header>
    )
}

export default PrimaryHeader
