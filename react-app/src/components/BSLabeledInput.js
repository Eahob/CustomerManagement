import React from 'react'

function BSLabeledInput(props) {
    const query = props.query
    return (
        <div className="form-group">
            <label htmlFor={query}>{props.label}</label>
            <input value={props.value} onChange={e => props.read(e.target.value, e.target.id)} className="form-control" id={query} placeholder={props.placeholder} type="text" />
        </div>
    )
}

export default BSLabeledInput
