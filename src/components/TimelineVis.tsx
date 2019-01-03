import * as React from 'react';
import * as d3 from "d3";
import * as d3Scale from 'd3-scale'
import * as _ from "lodash";



export class TimelineVis extends React.Component<any, any> { 
   primaryList:any;

    constructor(props)
    {
        super(props);
        this.state = {highlightProjects:[],
            highlightSubjects:[],
          currentProject:'',
          currentSubect:''};          
          this.primaryList  =  ["Hypertext", "Robotics", "Graphics", "Camera", "Social", "UI-Information", "Media", "Photos", "Presentation", "Machine Learning", "Visualization"];     
 
    }

    calcHighlight(aproject) {
        if (this.props.currentProjects.indexOf(aproject)>=0)
          return("highlighted");
        else return("normal")
    }

    localHandleClick(val) {
        this.props.handleClick(val);
    }

    render() {
        const {  items } = this.props;
        var sm = 0;
        var colorScale = d3Scale.scaleOrdinal(d3.schemeCategory10);
        var runsum = [];
        var b = _.countBy(items, function (d) { return d.primary });
        var marginx = 50;
        var marginy = 20;
        var foo =
        _.sortBy(
            _.uniq(
                _.flatten(
                    _.map(items, function (d) { return d.primary })
                )
            )
        );
        var counts = _.map(this.primaryList,
            function (d) {
                if (typeof(b[d]) != 'undefined') {
                    return(b[d]);
                } else {
                    return(0);
                }
            });
        _.each(counts, function (d) { sm += d; runsum.push(sm) })
        var width = this.props.width;
//        var height = Math.max(this.props.height, 800);
        var height = 800;


        var x_extent = d3.extent(items, function (d) { return d.tags.year });
        var length = items.length;
        var primarylength = this.primaryList.length;
        var x_scale = d3Scale.scaleLinear()
            .range([0, width])
            .domain([x_extent[0] - 2, Math.floor(x_extent[1]) + 2]);

        var y_scale = d3.scaleLinear()
            .range([height - marginy, marginy])
            .domain([0, length]);

        var legend_scale = d3.scaleLinear()
            .range([height - marginy-30, marginy])
            .domain([0, primarylength]);
        var height_scale = d3.scaleLinear()
            .range([0, height - (2 * marginy)])
            .domain([0, length]);
    //   var x_axis = d3.svg.axis().scale(x_scale);
    //   var y_axis = d3.svg.axis().scale(y_scale).orient('left');
    //   x_axis.tickFormat(d3.format());

       var self = this;
        var groupedList = _.groupBy(items, function (d) { return d.primary })
        var sortedData = _.sortBy(items, function (d) { return -1 * d.tags.year });

        var groups = []
         _.each(groupedList, (d, index)=>{ groups = groups.concat(layoutGroup(d, index, this.primaryList)) });

        var rects = this.primaryList.map((d,i)=> {
            return(<rect key={"r"+i} x={0} y={y_scale(runsum[i])} width={width} height={height_scale(counts[i])} fill={colorScale(_.indexOf(foo,d))} fillOpacity={0.3} /> )
        });

        
        return (
        
            <svg cursor="pointer" width={width} height={height} className='chart'>
                {rects}
                {groups}
            </svg>
        );
 

        function layoutGroup(groupArray, groupName, primaryList) {
        
            var baseIndex = _.indexOf(primaryList, groupName);
            var baseCount = baseIndex == 0 ? 0 : runsum[baseIndex - 1];
            var sortedGroup = _.sortBy(groupArray, (d)=>d.tags.year);
            
            var groupElements = _.map(sortedGroup, (d,i)=>{
                return(
                    <g key={"g"+ groupName + i}>
                        <text className = {self.calcHighlight(d.caption)}  onClick=  {(e)=>self.localHandleClick(d.caption)} key={"t"+i} x={x_scale(d.tags.year)+5} y={y_scale(baseCount+i)-2} cursor="pointer"> {d.caption} </text>
                        <circle className = {self.calcHighlight(d.caption)}  onClick=  {(e)=>self.localHandleClick(d.caption)} cx={x_scale(d.tags.year)-2} cy={y_scale(baseCount+i)-5} r={3}> </circle>
                       <text key={"title"+i} x={3} y={y_scale(baseCount+sortedGroup.length/2)+5} className="titleClass">{groupName}</text>
                    </g>
                );               
            });
            return(groupElements);        
        }
    }
}



export default TimelineVis;