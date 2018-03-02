import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter, Router, browserHistory } from 'react-router';
import axios from 'axios';

import Functionality from './components/Functionality';
import Login from './components/Login';
import Signup from './components/Signup';

import { getSequence } from './reducers/sequence';

import { emptySequenceData, emptySequenceOptions } from './lib/empty-sequence';

// class Main extends Component { 
export default function Main() {
    // componentDidMount() {
    //     axios.post('/api/users', {
    //         name: 'Regal',
    //         email: 'email@email.com',
    //         password: '1234'
    //     })
    //     .then(res => console.log(res.data))
    //     .then(
    //         axios.post('/api/sequences', {
    //             name: "empty sequence table",
    //             data: emptySequence(),
    //             options: emptyOptionsSequence,
    //             userId: 1
    //         })
    //     )
    //     .catch(err => console.error(err));
    // }

    // render() {
    return (
            <main autoFocus={true}>
                <Switch>
                    {/*<Route exact path="/signup" component={Signup} />
                    <Route exact path="/" component={Login} />
                    onEnter={getFirstSavedSequence()}*/}
                    <Route exact path="/" component={Functionality} /> 
                    <Redirect to="/" />
                </Switch>
            </main> 
    )
// }
}

// const mapStateToProps = () => {
//     return {};
// }

// const mapDispatchToProps = () => dispatch => {
//     return {
//         setEmptySequence: () => {
//             const emptySequence = {
//                 data: emptySequenceData,
//                 options: emptySequenceOptions
//             }
//             dispatch(getSequence(emptySequence));
//         }
//     };
// }

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
