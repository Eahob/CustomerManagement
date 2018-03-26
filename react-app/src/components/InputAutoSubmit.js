import React from 'react'

function InputAutoSubmit(props) {
    return (
        <div className="input-group col-md">
            {props.label && <div className="input-group-prepend">
                <span className="input-group-text">{props.label}</span>
            </div>}
            <input onChange={e => props.read(e.target.value, props.query)} className="form-control" placeholder={props.placeholder} type={props.type} />
        </div>
    )
}

export default InputAutoSubmit
