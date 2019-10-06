import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, hashHistory } from 'react-router-dom';
import { About } from "./components/About";
import { MyNav } from './components/MyNav';
import { CV } from './components/CV';
import { Feature } from './components/Feature';
class One extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("div", null, "ONE")));
    }
}
class Two extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("div", null, "TWO")));
    }
}
class Root extends React.Component {
    render() {
        return (React.createElement(Router, { history: hashHistory },
            React.createElement("div", null,
                React.createElement(MyNav, null),
                React.createElement(Route, { exact: true, path: "/", component: About }),
                React.createElement(Route, { path: "/about", component: About }),
                React.createElement(Route, { path: "/Featured", component: Feature }),
                React.createElement(Route, { path: "/CV", component: CV }))));
    }
}
ReactDOM.render(React.createElement(Root, null), document.getElementById('app'));
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
