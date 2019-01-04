import * as React from 'react';
import * as _ from "lodash";
import {Row, Col, Button, SplitButton, MenuItem} from 'react-bootstrap';
import Card from '../components/Card';
//import FacetPanel from 'components/FacetPanel/FacetPanel';
//import { CSSGrid, SpringGrid, measureItems, makeResponsive,enterExitStyle } from 'react-stonecutter';
import Masonry from 'react-masonry-component';

var masonryOptions = {
  transitionDuration: 500,  
  itemSelector: ".researchItem",
  columnWidth: 200,
  gutter: 20,
  resize: true
};
const enterExitStyles = ['Simple', 'Skew', 'Newspaper',  'Fold Up', 'From Center', 'From Left to Right', 'From Top', 'From Bottom'];
export class Index extends React.Component<any, any> {
    constructor(props)
    {
        super(props);
    }
  componentWillMount() {

    this.setState({"over":null});
    this.handleOver = this.handleOver.bind(this);
    this.handleOut = this.handleOut.bind(this);
    this.localHandleClick = this.localHandleClick.bind(this);
  };
  handleOver(val) {
    this.setState({"over":val});
    this.props.brushOut(val);
  };
  handleOut(val) {
    this.setState({"over":null});
      this.props.brushReset(val);
  };
  localHandleClick(val) {
    this.props.handleClick(val);
  };

  generateCard(val,i) {
    var overItem = this.state.over;
    var highlighted = _.includes(this.props.currentProjects,val.caption);

    if (this.props.mode == "tile") {
      var theClass = highlighted ? "researchItem gridItem selected" : "researchItem gridItem ";
      theClass = (val == overItem) ? "researchItem gridItem  myOver" : theClass;
    } else if (this.props.mode == "details") {
      var theClass = highlighted ? "researchItem detailItem selected" : "researchItem detailItem ";
      theClass = (val == overItem) ? "researchItem detailItem  myOver" : theClass;
    } else { 
       var theClass = highlighted ? "researchItem publicationItem selected" : "researchItem publicationItem ";
      theClass = (val == overItem) ? "researchItem publicationItem  myOver" : theClass;
    }
    return(<div className={theClass} key={"k"+val.id}>
            <Card theItem={val} mode={this.props.mode} handleOver={e=>this.handleOver(e)} 
            handleOut={e=>this.handleOut(e)} handleClick={e=>this.localHandleClick(e)} />
          </div>
    );
  }
 
  render() {
    if (this.props.items.length === 0) {
      return (
        <p ref="empty">Index is empty. </p>        
      );
    }
    var dataList =  this.props.items.map( (val,i) => {
      var aCard = this.generateCard(val,i);
      return(aCard);  
    });
              
 //const { Grid } = this.state;
 return (
    
    

    <Masonry
        className={'indexClass'}
        elementType={'div'}  
        options={masonryOptions}
        disableImagesLoaded={false}
        updateOnEachImageLoad={false}
        >
        {dataList}
        </Masonry>);
  }    
}


export default Index;
