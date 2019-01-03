import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSON from "../data/researchData.json"
import { BrowserRouter as Router, Route, Link, hashHistory} from 'react-router-dom'
import {About} from "./components/About"
import { MyNav } from './components/MyNav';
import {CV} from './components/CV';
import {Feature} from './components/Feature';
import {Research} from './components/Research';
  

class Root extends React.Component<any, any> {
    render() {
        return(            
            <Router history={hashHistory}>                
            <div>         
                <MyNav />
                    <Route exact path="/" component={About}/>
                    <Route path="/about" component={About}/> 
                    <Route path="/Featured" component={Feature}/>
                    <Route path="/Research" component={Research}/>
                    <Route path="/CV" component={CV}/>                                      
            </div>
        </Router>);
    }
}
ReactDOM.render( 
    <Root />

, document.getElementById('app')); 
