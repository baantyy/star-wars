import React from 'react'
import axios from 'axios'

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            planets: [],
            search: "",
            filteredPlanets: [],
            isLoaded: false,
            searchCount: 15,
            user: ""
        }
    }

    componentDidMount(){
        if(!localStorage.getItem('user')){
            this.props.history.push('/')
        }else{
            document.title = "Search"
            axios.get(`https://swapi.co/api/planets/`)
                .then(res => {
                    this.setState(() => ({
                        planets: res.data.results,
                        filteredPlanets: res.data.results,
                        isLoaded: true,
                        user: JSON.parse(localStorage.getItem('user'))
                    }))
                    this.resetCounter()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    resetCounter = () => {
        setInterval(() => {
            this.setState({ searchCount: 15 })
        }, 60000)
    }

    handleSearch = (e) => {
        const value = e.target.value
        const { searchCount, user } = this.state
        this.setState({ search: value })

        if(user === 'Luke Skywalker'){
            this.setState((prevState) => ({
                filteredPlanets: prevState.planets.filter(planet => planet.name.toLowerCase().includes(value.toLowerCase()))
            }))
        }else{
            if(searchCount > 0){
                this.setState((prevState) => ({
                    filteredPlanets: prevState.planets.filter(planet => planet.name.toLowerCase().includes(value.toLowerCase())),
                    searchCount: prevState.searchCount - 1
                }))
            }else{
                this.setState(() => ({
                    filteredPlanets: []
                }))
            }
        }
    }

    logout = () => {
        this.props.history.push('/')
        localStorage.removeItem('user')
    }

    render(){

        const { search, filteredPlanets, isLoaded, user, searchCount } = this.state
        const population = (filteredPlanets.length > 0) ? filteredPlanets.map(planet => planet.population !== 'unknown' ? Number(planet.population) : 0) : [0]
        const largest = String(Math.max(...population))
        
        return(
            <div className="searchPage">
                { isLoaded ?
                <React.Fragment>
                    <div className="search">
                        <input type="text"
                            placeholder="Search Planet"
                            onChange={this.handleSearch}
                            name="search"
                            value={search}
                            />

                        <button className="btn btn-danger" onClick={this.logout}>Logout</button>
                    </div>
                    <div className="container">

                        <p className="text-center">Max Api Request : { user === 'Luke Skywalker' ? 'Unlimited' : searchCount }</p>

                        <div className="planets">
                            <ul>
                                { (filteredPlanets.length > 0 && search !== "") &&
                                    filteredPlanets.map(planet => {
                                        return (
                                            <li key={ planet.name } className={ largest === planet.population ? 'bgFont' : '' }>{ planet.name }</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </React.Fragment> :
                <div className="pageLoader">
                    <div className="spinner-grow" role="status"></div>
                </div>
                }
            </div>
        )
    }
}

export default Search