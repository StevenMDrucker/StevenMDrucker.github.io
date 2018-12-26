import * as React from 'react';
import JSON from "../../data/researchData.json"
import * as _ from "lodash";
import {Form, FormControl, Button,ButtonToolbar, DropdownButton, SplitButton, MenuItem, Grid, Row, Col, Tabs, Tab, PanelGroup, Panel } from 'react-bootstrap';
import {Index} from "../components/Index";



export class Research extends React.Component<any, any> {
    globalData = [];
    facetPanels = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.globalData = JSON;
        this.state = {researchData:[],
            currentProjects:[],
            highlight:[],
            itemHovered:'',
            sortedBy:'year',
            reverse: false,
            mode:"tile",
            searchTerm: "",
            filterSpec:{}};
        this.globalData = this.calculateResults({}, "year", true,"");    
        this.resetData();
        this.tileMode();
    }

    calculateResults(localFilterSpec, localOrderBy, localReverse, localSearchTerm ) {
        var results = 
              _.reduce(localFilterSpec, (result, value, key) => {
                  result= _.filter(result, (o) => {
                      return !_.isEmpty(_.intersection(value,o.tags[key]))}); 
                  return result}, this.globalData)
       var afacet = localOrderBy;
       var finalresults = (localReverse) ? _.reverse(_.sortBy(results, (a)=>a.tags[afacet])) : _.sortBy(results, (a)=>a.tags[afacet]);
       
       var searchResearchData = localSearchTerm.length==0 ?  finalresults : finalresults.filter((a)=>_.startsWith(_.toLower(a.caption), _.toLower(localSearchTerm)));
       return(searchResearchData);
    }
    onSortBy(afacet:string) {
        var reverse  = false;
        if (this.state.sortedBy === afacet) {
            if (this.state.reverse) {
              this.setState({"reverse":false});
            } else {
                reverse = true;
                this.setState({"reverse":true});
            }
        } else {
            this.setState({"sortedBy":afacet});
        }
        
        this.setState({"researchData": this.calculateResults(this.state.filterSpec, afacet, reverse, this.state.searchTerm)});
    }
    
    convertData(anItem) {
        var facetlist = _.filter(_.keys(anItem), (a)=>_.startsWith(a,"facet"));
        var newItem = Object.assign({}, anItem);
        newItem["tags"] = {};
        _.each(facetlist, (afacet)=>{
            delete newItem[afacet];
            var facetname = afacet.split('.')[1]
            newItem["tags"][facetname]=anItem[afacet].split(',');
        });
        return(newItem);
    }
    resetData() {
        this.setState({"searchTerm":""});
        this.setState({"filterSpec":{}});
        this.setState({"reverse":false});
        this.setState({"researchData":this.globalData});
    }

    calculateLocalData() { 
        if (this.globalData != null) {
            var facets = _.keys(this.globalData[0].tags);
            var researchData = this.globalData;
            var filterSpec = this.state.filterSpec;        
            _.each(facets, val=>{
                var localfilterspec =_.omit(filterSpec,val);
                this.facetPanels[val] = _.reduce(localfilterspec, function(result, value, key) {result= _.filter(result, function(o) {return !_.isEmpty(_.intersection(value,o.tags[key]))}); return result}, researchData)
            });
        }
    }

    searchUpdated(e) {
        var term = e.target.value;
        this.setState({"searchTerm":term});
        this.setState({"researchData": this.calculateResults(this.state.filterSpec, this.state.orderBy, this.state.reverse, term)});   
      }

    tileMode() {
        this.setState({'mode':"tile"})
    }
    
    detailMode() {
        this.setState({'mode':"details"})
    }
    
    keywordMode() {
        this.setState({'mode':"keyword"})
    }
    timelineMode() {
        this.setState({'mode':"timeline"})
    }
    publicationMode() {
        this.setState({'mode':"publication"})
    }

    render() {
        const divStyle = {
            margin: '0 20 2 20'
            };
        var self = this;
        var subjects = [];
        var years = [];
        var collaborators = [];
        var tabList = [];
        var resultsDisplay:any;        
        if (this.state != null) {
            if (!_.isEmpty(this.state.researchData)) {                
                this.calculateLocalData();
                debugger;
                if (this.state.mode == "tile" || this.state.mode == "details" || this.state.mode == "publication") {
                    resultsDisplay = <Index mode={this.state.mode} items={this.state.researchData} currentProjects={this.state.currentProjects} handleClick={this.openModal} brushOut={this.handleBrushOut} brushReset={this.handleBrushReset}/>
                }
                self = this;
                var i=0;  
                if (this.state.researchData.length > 0) {
                    var facets = _.keys(this.state.researchData[0].tags);
                    var sortByItems = facets.map((afacet,i)=> <MenuItem key={i} eventKey={i} onSelect={(e)=>this.onSortBy(afacet)}> {afacet} </MenuItem>  );
                    var rowStyle = {
                        margin: "0 0 0 25",
                    }
                    var buttonBarStyle = {
                        margin: "0 0 10 0",
                    }
                //                            <SearchInput className="search-input" onChange={this.searchUpdated} />
                    var itemsDisplayedString = this.state.researchData.length == 1 ? 
                        this.state.researchData.length + " item displayed" :
                        this.state.researchData.length + " items displayed";
                    return(<div> 
                        <Grid className="show-grid" fluid={true} style={rowStyle}>           
                            <Row>          
                                <Col lg={10} sm={10} md={10}>
                                    <Row>
                                    <Col lg={6} sm={6} md={6}>
                                        <ButtonToolbar style={{float:"left"}}>                         
                                            {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
                                            <Button key="Tiles" style={{background: "brown"}} bsSize="small"  onClick={self.tileMode}>Tile</Button>
                                            <Button key="Details" bsSize="small" bsStyle="primary" onClick={self.detailMode}>Detail</Button>
                                            <Button key="Publications" bsSize="small" bsStyle="success"  onClick={self.publicationMode}>Publication</Button>
                                            <Button key="TimelineVis"  bsSize="small" bsStyle="info" onClick={self.timelineMode}>TimelineVis</Button>
                                            <Button key="KeywordVis"  bsSize="small" bsStyle="warning" onClick={self.keywordMode}>KeywordVis</Button>                           
                                            <DropdownButton style={{float:"right"}} bsSize="small" title={"Sort By: " + self.state.sortedBy + " " + ((self.state.reverse) ? String.fromCharCode( 8595 ) : String.fromCharCode( 8593 ))} pullRight id="split-button-pull-right">
                                            {sortByItems}
                                            </DropdownButton>                          
                                        </ButtonToolbar>
                                    </Col>
                                    <Col lg={4} sm={4} md={4} lgOffset={1} smOffset={1} mdOffset={1}>
                                        <div style={{padding:"0 20 0 0", display:"table-cell", verticalAlignment:"middle"}}> {itemsDisplayedString}  </div>
                                            <Form  inline style={{padding:"0 0 5 0", display:"table-cell", verticalAlignment:"middle"}}>
                                                <FormControl
                                                    bsSize="small"
                                                    type="text"
                                                    value={this.state.searchTerm}
                                                    placeholder="Search"
                                                    onChange={this.searchUpdated}
                                                />
                                            </Form>
                                    </ Col>
                                    </Row>
                                    <Row style={{height:"800px", overflow: "auto", marginTtop:"10px", paddingTop:"10px"}}>                    
                                        {resultsDisplay}                        
                                    </Row>
                                </Col>
                                <Col lg={2} sm={2} md={2}>
                                    <Row>
                                    <ButtonToolbar>
                                        <Button style={divStyle} bsSize="small" bsStyle="default" onClick={self.resetData} >Reset Filter</Button>
                                    </ButtonToolbar>
                                    
                                    </Row>
                        
                                    <PanelGroup defaultActiveKey={1} id="uncontrolled-tab-example" accordion>
                                        {tabList}
                                    </PanelGroup>
                                </Col>                   
                            </Row>
                        </Grid>
                    </div>);
                }
            }
        }
        return(
            <div> </div>
        )
    }
}