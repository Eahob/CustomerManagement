import React from 'react'

function InputAutoSubmit(props) {
    return (
        <div className="col-md">
            <input onChange={e => props.read(e.target.value, props.query)} className="form-control" placeholder={props.placeholder} type={props.type} />
        </div>
    )
}

export default InputAutoSubmit
