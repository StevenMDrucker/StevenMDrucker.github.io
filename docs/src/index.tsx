import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import JSON from "../data/researchData.json"
import { BrowserRouter, HashRouter as Router, Route, Link, hashHistory, Switch} from 'react-router-dom'
import {About} from "./components/About"
import { MyNav } from './components/MyNav';
import {CV} from './components/CV';
import {Feature} from './components/Feature';
import {Research} from './components/Research';
import {createHashHistory } from 'history'; 

class Root extends React.Component<any, any> {
    history = createHashHistory({ basename: '/SDruckerHome' });
    render() {
        console.log("public URL" + process.env.PUBLIC_URL);
        return(            
            <Router basename="/">                 
            <div>         
                <MyNav />
                <Switch>
                    <Route  path='/about' component={About}/> 
                    <Route  path='/Featured' component={Feature}/>
                    <Route  path='/Research'  component={Research}/>
                    <Route  path='/CV' component={CV}/>                                      
                    <Route exact path= '/'  component={About}/>
                    {/* <Route  path={process.env.PUBLIC_URL + '/about'} component={About}/> 
                        <Route  path={process.env.PUBLIC_URL + '/Featured'} component={Feature}/>
                        <Route  path={process.env.PUBLIC_URL + '/Research'}  component={Research}/>
                        <Route  path={process.env.PUBLIC_URL + '/CV'} component={CV}/>                                      
                        <Route exact path={process.env.PUBLIC_URL + '/'}  component={About}/> */}

                </Switch>
            </div>
        </Router>);
    }
}
ReactDOM.render( 
    <Root />

, document.getElementById('app')); 

/*
   <ul>
                    <li> 
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/one">One</Link>
                    </li>
                    <li>
                        <Link to="/two">Two</Link>
                    </li>
                    </ul>
                    */