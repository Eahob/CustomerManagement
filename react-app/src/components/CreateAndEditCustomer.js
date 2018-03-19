import React from 'react';
import api from 'api-client'

api.protocol = 'http'
api.host = 'localhost'
api.port = '5000'

class CreateAndEditCustomer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div className="mx-4">
                <p>{'id: ' + this.props.match.params.id}</p>
            </div>
        )
    }
}

export default CreateAndEditCustomer
