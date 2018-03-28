import React from 'react'
import InputAutoSubmit from './InputAutoSubmit'
import api from '../api-config'

class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            user: '',
            pass: ''
        }
    }
    componentWillMount() {
        api.validate(this.props.token).then(res => {
            this.setState({message:''})
            if (res.status === 'OK') {
                this.setState({ validToken: true })
            } else {
                this.props.saveToken()
            }
        })
    }
    readInput = (input, query) => {
        this.setState({ [query]: input })
    }
    submit() {
        api.login(this.state.user, this.state.pass).then(res => {
            //console.log(res)
            if (res.data) {
                this.props.saveToken(res.data.token)
                this.setState({ user: '', pass: '', validToken: true, message:'Loged in' })
            } else {
                this.props.saveToken()
                this.setState({ validToken: false, message:res.error })
            }
        })
    }
    render() {
        return (
            <div id="home" className="text-white d-flex flex-column">
                <h1 className="inline-block text-center display-4 mb-4"><em>Customer Management demo</em></h1>
                <div className="mx-auto">
                    <p>Here you can create new customers, search them, modify them and consult what they did</p>
                    <p>You can search modify and add products or services for your customers in the top menu</p>
                    {this.state.validToken || <form className="mb-4" onSubmit={e => {
                        e.preventDefault()
                        this.submit()
                    }}>
                        <div className="row mt-4">
                            <InputAutoSubmit read={this.readInput} label="Username" query="user" />
                            <InputAutoSubmit read={this.readInput} label="Password" query="pass" type="password" />
                        </div>
                        <button className="mt-4 col btn btn-secondary" type="submit">Login</button>
                        
                    </form>}
                    <BSAlert2 stt={this.state}/>
                </div>
                <footer className="inline-block text-center mt-auto text-secondary">
                    <p>Developed by <a className="badge badge-secondary" href="https://github.com/Eahob">Eahob</a></p>
                </footer>
            </div>
        )
    }
}

function BSAlert2(props) {
    if (!props.stt.message) return null

    return (
        <div className={'BSAlert alert alert-' + (props.stt.validToken ? 'success' : 'danger')} role="alert">
            <span>{props.stt.message}</span>
        </div>
    )
}

export default Home
