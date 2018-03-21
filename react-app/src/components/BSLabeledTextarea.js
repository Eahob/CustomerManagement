import React from 'react'

function BSLabeledTextarea(props) {
    const query = props.query
    return (
        <div className="form-group">
            <label htmlFor={query}>{props.label}</label>
            <textarea value={props.value} onChange={e => props.read(e.target.value, e.target.id)} className="form-control" id={query} rows={props.rows} />
        </div>
    )
}

export default BSLabeledTextarea