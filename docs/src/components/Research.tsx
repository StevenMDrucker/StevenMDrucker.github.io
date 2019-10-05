import * as React from 'react';
//import JSON from "../../data/researchData.json"
//import JSON from "https://gist.githubusercontent.com/StevenMDrucker/ff65d612c7ff3a611b571f2a95ed8ab6/raw/c3d4226e390060f51f771199c9c8872f39eed68e/researchData.json"
import * as _ from "lodash";
import { Form, FormControl, Button, ButtonToolbar, DropdownButton, SplitButton, MenuItem, Grid, Row, Col, Tabs, Tab, PanelGroup, Panel } from 'react-bootstrap';
import { Index } from "../components/Index";
import { FacetPanel } from "../components/FacetPanel";
import { MyPopup } from './MyPopup';
import {KeywordVis} from '../components/KeywordVis';
import {TimelineVis} from '../components/TimelineVis';
import ContainerDimensions from 'react-container-dimensions'
import * as D3 from "d3";


export class Research extends React.Component<any, any> {
    globalData = [];
    facetPanels = {};

    constructor(props) {
        super(props);

        // Bind the this context to the handler function
        this.handleBrush = this.handleBrush.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleBrushReset = this.handleBrushReset.bind(this);
        this.openModal = this.openModal.bind(this);
        this.searchUpdated = this.searchUpdated.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.state = {
            researchData: [],
            currentProjects: [],
            highlight: [],
            itemHovered: '',
            sortedBy: 'year',
            reverse: false,
            mode: "tile",
            searchTerm: "",
            filterSpec: {}
        };
        fetch(`https://gist.githubusercontent.com/StevenMDrucker/ff65d612c7ff3a611b571f2a95ed8ab6/raw/researchData.json`)        
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed with HTTP code " + response.status);
            }
            return(response.json())
        }).then(data=> {
            var finalresults =  _.reverse(_.sortBy(data, (a) => a.tags["year"]));
            this.globalData = finalresults;            
            this.globalData = this.calculateResults({}, "year", true, "");
            this.onSortBy("year");
            this.setState({"researchData": this.globalData}); 
            this.resetData();
            this.tileMode();
        });
    }
    
    calculateResults(localFilterSpec, localOrderBy, localReverse, localSearchTerm) {
        var results =
            _.reduce(localFilterSpec, (result, value, key) => {
                result = _.filter(result, (o) => {
                    return !_.isEmpty(_.intersection(value, o.tags[key]))
                });
                return result
            }, this.globalData)        
        var afacet = localOrderBy;        
        var finalresults = (localReverse) ? _.reverse(_.sortBy(results, (a) => a.tags[afacet])) : _.sortBy(results, (a) => a.tags[afacet]);

        var searchResearchData = localSearchTerm.length == 0 ? finalresults : finalresults.filter((a) => _.startsWith(_.toLower(a.caption), _.toLower(localSearchTerm)));
        return (searchResearchData);
    }
    onSortBy(afacet: string) {
        var reverse = false;
        if (this.state.sortedBy === afacet) {
            if (this.state.reverse) {
                this.setState({ "reverse": false });
            } else {
                reverse = true;
                this.setState({ "reverse": true });
            }
        } else {
            this.setState({ "sortedBy": afacet });
        }

        this.setState({ "researchData": this.calculateResults(this.state.filterSpec, afacet, reverse, this.state.searchTerm) });
    }

    convertData(anItem) {
        var facetlist = _.filter(_.keys(anItem), (a) => _.startsWith(a, "facet"));
        var newItem = Object.assign({}, anItem);
        newItem["tags"] = {};
        _.each(facetlist, (afacet) => {
            delete newItem[afacet];
            var facetname = afacet.split('.')[1]
            newItem["tags"][facetname] = anItem[afacet].split(',');
        });
        return (newItem);
    }
    resetData() {
        this.setState({ "searchTerm": "" });
        this.setState({ "filterSpec": {} });
        this.setState({ "reverse": false });
        this.setState({ "researchData": this.globalData });
    }

    openModal(myval: any) {

        if (typeof (myval) == "string") {
            var myIndex = _.findIndex(this.globalData, (a) => a.caption == myval);
            if (myIndex >= 0) {
                this.refs.myPopup.setState({ showModal: true, item: this.globalData[myIndex] });
            }
        } else {
            this.refs.myPopup.setState({ showModal: true, item: myval });
        }
    }



    calculateLocalData() {
        if (this.globalData != null) {
            var facets = _.keys(this.globalData[0].tags);
            var researchData = this.globalData;
            var filterSpec = this.state.filterSpec;
            _.each(facets, val => {
                var localfilterspec = _.omit(filterSpec, val);
                this.facetPanels[val] = _.reduce(localfilterspec, function (result, value, key) { result = _.filter(result, function (o) { return !_.isEmpty(_.intersection(value, o.tags[key])) }); return result }, researchData)
            });
        }
    }

    searchUpdated(e) {
        var term = e.target.value;
        this.setState({ "searchTerm": term });
        this.setState({ "researchData": this.calculateResults(this.state.filterSpec, this.state.orderBy, this.state.reverse, term) });
    }

    tileMode() {
        this.setState({ 'mode': "tile" })
    }

    detailMode() {
        this.setState({ 'mode': "details" })
    }

    keywordMode() {
        this.setState({ 'mode': "keyword" })
    }
    timelineMode() {
        this.setState({ 'mode': "timeline" })
    }
    publicationMode() {
        this.setState({ 'mode': "publication" })
    }

    handleBrush(title: any, val: any) {
        var projList = _.map(_.filter(this.state.researchData, (proj) => (_.includes(proj.tags[title], val))), (aProj) => aProj.caption);
        this.setState({ "currentProjects": projList });
        this.setState({ "highlight": [title, val] });
    }

    handleBrushOut(val) {
        this.setState({ 'itemHovered': val });
        this.setState({ "currentProjects": [] });
        this.setState({ "highlight": [] });
    }

    handleBrushReset() {
        this.setState({ 'itemHovered': '' });
        this.setState({ "currentProjects": [] });
        this.setState({ "highlight": [] });
    }

    handleFilter(title: any, val: any) {
        var localFilterSpec = this.state.filterSpec;
        if (title in localFilterSpec) {
            if (localFilterSpec[title].indexOf(val) >= 0) {
                localFilterSpec[title] = _.filter(localFilterSpec[title], (a) => (a != val));
                if (_.isEmpty(localFilterSpec[title])) {
                    delete localFilterSpec[title];
                }
            } else {
                localFilterSpec[title].push(val);
            }
        } else {
            localFilterSpec[title] = [val];
        }
        this.setState({ "filterSpec": localFilterSpec });
        this.setState({ "researchData": this.calculateResults(localFilterSpec, this.state.orderBy, this.state.reverse, this.state.searchTerm) });
    }

    handleExit() {
        this.setState({ 'highlight': '' });
        this.setState({ "currentProjects": [] });
        this.setState({"over":null});
    }


    render() {
        var self = this;
        var subjects = [];
        var years = [];
        var collaborators = [];
        var tabList = [];
        if (this.state != null) {
            if (!_.isEmpty(this.state.researchData)) {
                this.calculateLocalData();
                var self = this;
                var i = 0;
                tabList = _.map(this.facetPanels, (filteredVals, tag) => {
                    i++;
                    var values = _.countBy(_.flatMap(filteredVals, val => val.tags[tag]));
                    //   <Tab eventKey={i} title={tag}>
                    //         <FacetPanel items={values} filterSpec={this.state.filterSpec} itemTitle={tag} selected = {this.state.itemHovered} brush = {this.handleBrush} filter = {this.handleFilter} clearFilter= {this.handleExit}>
                    //         </FacetPanel>
                    //   </Tab>);
                    return (
                        //     <Tab eventKey={i} title={tag}>
                        //         <FacetPanel items={values} filterSpec={this.state.filterSpec} itemTitle={tag} selected = {this.state.itemHovered} brush = {this.handleBrush} filter = {this.handleFilter} clearFilter= {this.handleExit}>
                        //         </FacetPanel>
                        //   </Tab>);
                        <Panel key={i} eventKey={i} header={tag} className="filterPanel" style={{ "cursor": "pointer" }}>
                            <Panel.Heading>
                                <Panel.Title componentClass="h3" toggle>{tag}
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body collapsible>
                                <FacetPanel key={"P" + i} items={values} filterSpec={this.state.filterSpec} itemTitle={tag} selected={this.state.itemHovered} brush={this.handleBrush} filter={this.handleFilter} clearFilter={this.handleExit}>
                                </FacetPanel>
                            </Panel.Body>
                        </Panel>);
                });
            }
        if (!_.isEmpty(this.state.researchData) && this.state.researchData.length > 0) {
            var facets = _.keys(this.state.researchData[0].tags);
            var sortByItems = facets.map((afacet,i)=> <MenuItem key={i} eventKey={i} onSelect={(e)=>this.onSortBy(afacet)}> {afacet} </MenuItem>  );
        } else {
            sortByItems = '';
        }
                 // <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    //     {tabList}
                    // </Tabs>
        const divStyle = {
        margin: '0 20 2 20'
        };
        var resultsDisplay:any = '';
        if (this.state.mode == "tile" || this.state.mode == "details" || this.state.mode == "publication") {
            resultsDisplay = <Index mode={this.state.mode} items={this.state.researchData} currentProjects={this.state.currentProjects} handleClick={this.openModal} brushOut={e => this.handleBrushOut(e)} brushReset={e => this.handleBrushReset()} />            
        } else if (this.state.mode == "keyword") {
            resultsDisplay = <div> 
                <ContainerDimensions>
                    { ({width, height}) =>
                    <KeywordVis items={this.state.researchData} currentProjects={this.state.currentProjects} highlight={this.state.highlight} handleClick={this.openModal} width={width} height={960}>
                    </KeywordVis> 
                    }
                </ContainerDimensions>                    
              </div>
              
        } else if (this.state.mode == "timeline") {
            resultsDisplay = <div>
                <ContainerDimensions> 
                   { ({ width, height }) => 
                    <TimelineVis items={this.state.researchData} currentProjects={this.state.currentProjects} handleClick={this.openModal} width={width} height={height}>
                    </TimelineVis> 
                    
                    }
                 </ContainerDimensions>
              </div>
              
        } else  resultsDisplay = <div>No View</div>
        var rowStyle = {
            margin: "0 0 0 25",
        }
        var buttonBarStyle = {
            margin: "0 0 10 0",
        }
    //                            <SearchInput className="search-input" onChange={this.searchUpdated} />
        var itemsDisplayedString = '';    
        if (!_.isEmpty(this.state.researchData)) {
             itemsDisplayedString = this.state.researchData.length == 1 ? 
            this.state.researchData.length + " item displayed" :
            this.state.researchData.length + " items displayed";
        }
        return(<div> 
            <Grid className="show-grid" fluid={true} style={rowStyle}>           
                <Row>          
                    <Col lg={10} sm={10} md={10}>
                        <Row>
                        <Col lg={6} sm={6} md={6}>
                              <ButtonToolbar style={{float:"left"}}>                         
                                {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
                                <Button key="Tiles" style={{ background: "brown" }} bsSize="small" onClick={e => this.tileMode()}>Tile</Button>
                                <Button key="Details" bsSize="small" bsStyle="primary" onClick={e => this.detailMode()}>Detail</Button>
                                <Button key="Publications" bsSize="small" bsStyle="success" onClick={e => this.publicationMode()}>Publication</Button>
                                <Button key="TimelineVis" bsSize="small" bsStyle="info" onClick={e => this.timelineMode()}>TimelineVis</Button>
                                <Button key="KeywordVis" bsSize="small" bsStyle="warning" onClick={e => this.keywordMode()}>KeywordVis</Button>
                                <DropdownButton style={{float:"right"}} bsSize="small" title={"Sort By: " + self.state.sortedBy + " " + ((self.state.reverse) ? String.fromCharCode( 8595 ) : String.fromCharCode(8593))} pullRight id="split-button-pull-right">
                                 {sortByItems}
                                </DropdownButton>                          
                            </ButtonToolbar>
                        </Col>
                        <Col lg={4} sm={4} md={4} lgOffset={1} smOffset={1} mdOffset={1}>
                              <div style={{padding:"0 20px 0 0", display:"table-cell", verticalAlignment:"middle"}}> {itemsDisplayedString}  </div>
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
                        <Row className="resultsDisplay">
                            {resultsDisplay}
                        </Row>
                    </Col>
                    <Col lg={2} sm={2} md={2}>
                        <Row>

                            <Button style={divStyle} bsSize="small" bsStyle="default" onClick={e=>this.resetData()} >Reset Filter</Button>

                            <MyPopup ref="myPopup"> </MyPopup>                                      
                        </Row>
            
                        <PanelGroup defaultActiveKey={1} id="uncontrolled-tab-example" accordion>
                            {tabList}
                        </PanelGroup>
                    </Col>                   
                </Row>
            </Grid>
        </div>);
      }
    };
}