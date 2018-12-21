import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSON from "../data/researchData.json"

const app = (         
        <section> Hello Steven! {JSON[0].booktitle}</section>     

);

ReactDOM.render(app, document.getElementById('app'));