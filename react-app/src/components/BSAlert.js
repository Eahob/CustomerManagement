import React from 'react'

function BSAlert(props) {
    if (!props.stt.responseStatus) return null
    
    return (
        <div className={' alert alert-' + (props.stt.error ? 'danger' : 'success')} role="alert">
            <h4>{props.stt.error ? props.alertError : props.alertSuccess}</h4>
            {props.stt.error && <p>{props.stt.error}</p>}
        </div>
    )
}

export default BSAlert
