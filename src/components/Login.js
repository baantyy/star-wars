import React from 'react'
import axios from 'axios'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username: "",
            password: "",
            status: "",
            isSubmitting: false
        }
    }

    componentDidMount(){
        document.title = "Login"
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { username, password } = this.state
        if(username === ''){
            this.setState({ status: 'Username is required' })
        }else if(password === ''){
            this.setState({ status: 'Password is required' })
        }else{
            this.setState({ isSubmitting: true })
            axios.get(`https://swapi.co/api/people/?search=${username}`)
                .then(res => {
                    if(res.data.results.length > 0){
                        if(res.data.results[0].name === username){
                            if(res.data.results[0].birth_year === password){
                                localStorage.setItem('user', JSON.stringify(username))
                                this.props.history.push("/search")
                            }else{
                                this.setState(() => ({ 
                                    status: 'Password is incorrect',
                                    isSubmitting: false
                                }))
                            }
                        }else{
                            this.setState(() => ({ 
                                status: 'Username is invalid',
                                isSubmitting: false
                            }))
                        }
                    }else{
                        this.setState(() => ({ 
                            status: 'Username is invalid',
                            isSubmitting: false
                        }))
                    }
                })
                .catch(err => {
                    console.log(err)
                })
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
        const { username, password, status, isSubmitting } = this.state
        return(
            <div className="loginPage">
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

                        <button type="submit" className="btn">{ isSubmitting ? <i className="fas fa-spin fa-sync-alt"></i> : 'Login' }</button>

                    </form>
                </div>
            </div>
        )
    }
}

export default Login