
import * as React from 'react';
import { Image,  Row, Col } from 'react-bootstrap';
import ReactMarkdown  from 'react-markdown';
const headShot = require("../../images/justheadmed.jpg");
//const myText = require("../../data/cv.md");
export class About extends React.Component<any, any> {

    constructor(props) {
        super(props); 
        this.state = { info:null};
                
        //fetch(myText)                
        //fetch('https://stevenmdrucker.github.io/ResearchContent/CV.md')
        fetch('https://stevenmdrucker.github.io/ResearchContent/Bio.md')        
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed with HTTP code " + response.status);
            }
            return(response.text())
        }).then(text=> {
            this.setState( {info: text})
        });
    }

    render() {
        return(
            <div>
             <Col lg={2} md={2} sm={1}>
             </Col>
             <Col lg={8} md={8} sm={10}>        
             <div className="bio">
               <Row>
                   <Col lg={3} md={4} sm={5}>
                       <Image src={headShot} responsive></Image>
                   </Col>
                   <Col lg={7} md={6} sm={5}>
                       <div>
                           <ReactMarkdown source = {this.state.info} />
                        </div>
                   </Col>
   
                </Row>
           </div>
             </Col>          
             <Col lg={3} md={2} sm={1}>
             </Col>       
   
           </div>
           )
    }
}