import React from 'react';
import { NavLink } from 'react-router-dom'

function PrimaryHeader() {
  return (
    <ul className="nav nav-tabs mb-4 pt-4 px-4 bg-dark">
      <li className="nav-item mr-1">
        <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/customers">Customers</NavLink>
      </li>
      <li className="nav-item mr-1">
        <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/tickets">Tickets</NavLink>
      </li>
      <li className="nav-item mr-1">
        <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/services">Services</NavLink>
      </li>
      <li className="nav-item mr-1">
        <NavLink className="nav-link text-white" activeClassName="active text-dark" to="/Products">Products</NavLink>
      </li>
    </ul>
  )
}

export default PrimaryHeader
