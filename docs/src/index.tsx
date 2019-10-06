import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import JSON from "../data/researchData.json"
import { BrowserRouter as Router, HashRouter, Route, Link, hashHistory, Switch} from 'react-router-dom'
import {About} from "./components/About"
import { MyNav } from './components/MyNav';
import {CV} from './components/CV';
import {Feature} from './components/Feature';
import {Research} from './components/Research';
  

class Root extends React.Component<any, any> {
    render() {
        return(            
            <HashRouter basename='/SDruckerHome' history={hashHistory}>                
            <div>         
                <MyNav />
                <Switch>                    
                    <Route  path="/about" component={About}/> 
                    <Route  path="/Featured" component={Feature}/>
                    <Route  path="/Research" component={Research}/>
                    <Route  path="/CV" component={CV}/>                                      
                    <Route exact path="/" component={About}/>
                </Switch>
            </div>
        </HashRouter>);
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