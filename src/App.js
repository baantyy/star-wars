import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './components/Login'
import Search from './components/Search'

const App = () => {
    return (
        <BrowserRouter>
            <div className="app">          
                <Switch>

                    <Route path="/" component={Login} exact={true} />
                    <Route path="/search" component={Search} exact={true} />

                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App