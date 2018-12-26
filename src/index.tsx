import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSON from "../data/researchData.json"
import { BrowserRouter as Router, Route, Link, hashHistory} from 'react-router-dom'
import {About} from "./components/About"
import { MyNav } from './components/MyNav';
import {CV} from './components/CV';
import {Feature} from './components/Feature';
  
class One extends React.Component<any, any> {
    render() {
      return (
        <div>
          <div>ONE</div>
        </div>
      );
    }
}
  
class Two extends React.Component<any, any> {
    render() {
      return (
        <div>
          <div>TWO</div>          
        </div>
      ); 
    }
}

class Root extends React.Component<any, any> {
    render() {
        return(            
            <Router history={hashHistory}>                
            <div>         
                <MyNav />
                    <Route exact path="/" component={About}/>
                    <Route path="/about" component={About}/> 
                    <Route path="/Featured" component={Feature}/>
                    <Route path="/CV" component={CV}/>                                      
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