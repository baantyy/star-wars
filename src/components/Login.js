import React from 'react'
import axios from 'axios'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username: "",
            password: "",
            status: "",
            isLoaded: false,
            people: []
        }
    }

    componentDidMount(){
        document.title = "Login"
        axios.get(`https://swapi.co/api/people`)
            .then(res => {
                this.setState(() => ({
                    people: res.data.results,
                    isLoaded: true
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { username, password, people } = this.state
        if(username === ''){
            this.setState({ status: 'Username is required' })
        }else if(password === ''){
            this.setState({ status: 'Password is required' })
        }else{
            const user = people.find(user => user.name === username)
            if(!user){
                this.setState({ status: `Username doesn't exist` })
            }else{
                if(user.birth_year !== password){
                    this.setState({ status: 'Password is incorrect' })
                }else{
                    localStorage.setItem('user', JSON.stringify(username))
                    this.props.history.push("/search")
                }
            }
        }
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value,
            status: ""
        }))
    }

    render(){
        const { username, password, status, isLoaded } = this.state
        return(
            <div className="loginPage">
                { isLoaded && 
                    <div>
                        <h1>Login </h1>
                        <form onSubmit={this.handleSubmit}>
                            
                            <input type="text"
                                name="username"
                                value={username}
                                onChange={this.handleChange}
                                className="form-control"
                                placeholder="Username"
                                />
                        
                            <input type="password"
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                className="form-control"
                                placeholder="Password"
                                />      
                                
                            { status && <p className="text-danger">{status}</p> }

                            <button type="submit" className="btn">Login</button>

                        </form>
                    </div>
                }
            </div>
        )
    }
}

export default Login