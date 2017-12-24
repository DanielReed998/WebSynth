import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import NewPage from './components/NewPage';


function Main () {
     
    return (
        <div>  
            <Navbar />
            <main>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/anotherPage" component={NewPage} />
                    <Redirect to="/" component={Home} />
                </Switch>
            </main>
            <Footer />
        </div>   
    )
    
}

const mapStateToProps = () => {
    return {};
}

const mapDispatchToProps = () => dispatch => {
    return {};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

