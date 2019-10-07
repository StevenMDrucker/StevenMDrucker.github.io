import * as React from 'react';
import {Table, Accordion, Panel} from 'react-bootstrap';
import * as _ from "lodash";


export class FacetPanel extends React.Component<any, any> {

 componentWillMount() {
      this.setState(
        {"over":null,
         "order":"count",
        "orderReverse":"desc"}
    );


  };
  handleClick(title, val) {
      this.props.filter(title, val);
  };
  handleOver(title, val) {
    //  debugger;
      this.props.brush(title, val);
      this.setState({"over":val});
  };

  handleBrushOut() {
    //debugger;
      this.props.clearFilter();
      this.setState({"over":null});
  };
  setOrderBy(val) {
      var doReverse = "asc";
      if (this.state.order == val) {
          if (this.state.orderReverse == "desc") doReverse = "asc";
          else doReverse="desc";
      }
      this.setState({"order":val, "orderReverse":doReverse});
  }

  render() {
    if (this.props.items.length === 0) {
      return (
        <p ref="empty">Facet Panel is empty. </p>        
      );
    }
    var itemHoveredTags = [];
    var panelSubject = this.props.itemTitle;
    if (this.props.selected) {
        itemHoveredTags = this.props.selected.tags[panelSubject];
    }
    var overItem = this.state.over;
    if (this.state.order == "count") {    
        var mylist = _.orderBy(_.map(_.keys(this.props.items), (val) =>  {return {"name": val, "count": this.props.items[val]}}),"count", this.state.orderReverse);
    } else {
        var mylist = _.orderBy(_.map(_.keys(this.props.items), (val) =>  {return {"name": val, "count": this.props.items[val]}}),"name",this.state.orderReverse);    
    }
    var dataList = [];
    var filterSpec = this.props.filterSpec;
//    var dataList =  _.keys(this.props.items).map( (val,i) => {
    dataList = mylist.map( (val,i) => {
        var itemName = val["name"];
        var itemCount = val["count"];
        // var itemCount = this.props.items[val]; 
        var theClass = _.includes(itemHoveredTags, itemName) ? 'selected' : '';
        theClass = (val == overItem) ? "myOver" : theClass;
        var filtered = "";
        if (panelSubject in filterSpec) {
            if (_.indexOf(filterSpec[panelSubject], itemName) > -1) filtered = "x";
        }  
        var handleForBrush =   e=>this.props.brush(panelSubject,itemName);
        var handleBrushOut =   e=>this.props.clearFilter();
     
          return(<tr  className={theClass} key={"i"+i} onMouseOut= {handleBrushOut}  onMouseOver=  {handleForBrush}  onClick={e => this.handleClick(panelSubject,itemName)}>
          <td> {filtered} </td> 
          <td> {itemName} </td>
          <td> {itemCount}</td>
          </tr>);
      });

    return(<Table bordered condensed hover className="myFacet">
        <thead>
        <tr>
            <th>   </th>
            <th style={{"cursor":"pointer"}} onClick={(e)=>this.setOrderBy("name")}> {panelSubject} </th>
            <th style={{"cursor":"pointer"}} onClick={(e)=>this.setOrderBy("count")}> count </th>
        </tr>
        </thead>
        <tbody>
        {dataList}
        </tbody>
        </Table> )
  }    
}



export default FacetPanel;
