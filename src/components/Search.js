import React from 'react'
import axios from 'axios'

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            planets: [],
            search: "",
            isLoaded: false,
            searchCount: 15,
            user: "",
            intervalId: ""
        }
    }

    componentDidMount(){
        if(!localStorage.getItem('user')){
            this.props.history.push('/')
        }else{
            document.title = "Search"
            const intervalId = setInterval(() => {
                this.resetCounter()
            }, 60000)
            this.setState(() => ({
                intervalId,
                user: JSON.parse(localStorage.getItem('user'))
            }))
        }
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalId)
    }

    resetCounter = () => {
        this.setState({ searchCount: 15 })
    }

    planetSearch = (value, user) => {
        if(value !== ""){
            this.setState({ isLoaded: true })
            axios.get(`https://swapi.co/api/planets/?search=${value}`)
                .then(res => {
                    this.setState((prevState) => ({
                        planets: res.data.results,
                        isLoaded: false,
                        searchCount: user !== 'Luke Skywalker' ? prevState.searchCount - 1 : 15
                    }))
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    handleSearch = (e) => {
        const value = e.target.value
        const { searchCount, user } = this.state
        this.setState({ search: value })

        if(searchCount > 0){
            this.planetSearch(value, user)
        }else{
            this.setState(() => ({
                planets: []
            }))
        }
    }

    logout = () => {
        this.props.history.push('/')
        localStorage.removeItem('user')
    }

    render(){

        const { search, planets, isLoaded, user, searchCount } = this.state
        const population = (planets.length > 0) ? planets.map(planet => planet.population !== 'unknown' ? Number(planet.population) : 0) : [0]
        const largest = String(Math.max(...population))
        
        return(
            <div className="searchPage">
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
                        { isLoaded ? <div className="text-center"><i className="fas fa-spin fa-sync-alt"></i></div> :

                            (planets.length > 0 && search !== "") ?
                                <ul>
                                    { planets.map(planet => {
                                            return (
                                                <li key={ planet.name } className={ largest === planet.population ? 'bgFont' : '' }>{ planet.name }</li>
                                            )
                                        })
                                    }
                                </ul> : search !== '' && <div className="text-center">No records found</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Search