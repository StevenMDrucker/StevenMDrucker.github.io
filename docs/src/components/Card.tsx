import {Row, Col, Button, SplitButton, MenuItem} from 'react-bootstrap';
//import ReactHtmlParser from 'react-html-parser';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import ReactHtmlParser from  'react-html-parser';
//import * as ImageAssets from "../../researchImages/**";


export class CardComponent extends React.Component<any, any> { 
    static propTypes = {
        theItem: PropTypes.object,
        mode: PropTypes.string,
        handleOver: PropTypes.func,
        handleOut: PropTypes.func,
        handleClick: PropTypes.func
    } 

    constructor(props)
    {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.mode !== nextProps.mode) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        var val = this.props.theItem;        
        if (this.props.mode == "tile") {            
             var theCard = 
                <div onMouseEnter= {(e)=>this.props.handleOver(val)}
                    onMouseOut= {(e)=>this.props.handleOut(val)}
                    onClick=  {(e)=>this.props.handleClick(val)}
                    key={"i"+val.id}> 
                    <img src={"http://www.steven-drucker.com/client/"+val.img} width="180" height="120" />
                    {val.caption}
                </div>;
         } else if (this.props.mode == "details") {
            var theCard = 
                <div onMouseEnter= {(e)=>this.props.handleOver(val)}
                    onMouseOut= {(e)=>this.props.handleOut(val)}
                    onClick=  {(e)=>this.props.handleClick(val)}
                    key={"i"+val.id}> 
                    <Row>
                        <Col lg={2} sm={2} md={2}>
                        <Row>
                        <img className="detailsImage" src={"http://www.steven-drucker.com/client/"+val.img} width="180" height="120" />                        
                        </Row>
                        <Row  style={{textAlign: "left", margin: 5}}>
                            <Button bsStyle="primary" href={val.pdf}>Paper</Button>
                            <span> </span>
                            {val.video != '' ? <Button bsStyle="primary" href={val.video}>Video</Button> : null}
                        </Row>
                        </Col>
                        <Col lg={10} sm={10} md={10}>
                        <div className="DCaption"> {val.caption} </div>
                        <div className="DReference"> {ReactHtmlParser(val.bibEntry)}</div>                        
                        <div className="DAbstract"> {val.abstract}</div>
                        </Col>
                    </Row>
                </div>;
        } else if (this.props.mode == "publication") {
        var theCard =  
            <div onMouseEnter= {(e)=>this.props.handleOver(val)}
                onMouseOut= {(e)=>this.props.handleOut(val)}
                onClick=  {(e)=>this.props.handleClick(val)}
                key={"i"+val.id}>
                <Row> 
                <Col lg={12} sm={12} md={12}>
                    <span style={{display: "block", float:"left", marginRight:"5px"}}> <a href={val.pdf}> PDF </a> </span> <span className="DReference"> {ReactHtmlParser(val.bibEntry)}</span>
                </Col>
                </Row>
            </div>;
      }
      return(theCard);
    }
}


export default CardComponent;
