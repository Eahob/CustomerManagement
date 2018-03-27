import React from 'react'
import InputAutoSubmit from './InputAutoSubmit'
import api from '../api-config'

class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            user:'',
            pass:'',
            token: ''
        }
    }
    readInput = (input, query) => {
        this.setState({ [query]: input })
    }
    submit(){
        api.login(this.state.user,this.state.pass).then(res => {
            return res.data && res.data.token
        }).then(token => {
            if (token) {
                this.props.saveToken(token)
            } else {
                //error message
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
                    <form onSubmit={e => {
                            e.preventDefault()
                            this.submit()
                        }}>
                        <InputAutoSubmit read={this.readInput} label="Username" query="user"/>
                        <InputAutoSubmit read={this.readInput} label="Password" query="pass" type="password" />
                        <button type="submit">Login</button>
                    </form>
                </div>
                <footer className="inline-block text-center mt-auto text-secondary">
                    <p>Developed by <a className="badge badge-secondary" href="https://github.com/Eahob">Eahob</a></p>
                </footer>
            </div>
        )
    }
}

export default Home
