import * as React from 'react';
import JSON from "../data/researchData.json";
import * as _ from "lodash";
export class Research extends React.Component {
    constructor() {
        super(...arguments);
        this.globalData = [];
        this.facetPanels = {};
    }
    componentDidMount() {
        this.globalData = JSON;
        this.globalData = this.calculateResults({}, "year", true, "");
    }
    getInitialState() {
        return ({ researchData: [],
            currentProjects: [],
            highlight: [],
            itemHovered: '',
            sortedBy: 'year',
            reverse: false,
            mode: "tile",
            searchTerm: "",
            filterSpec: {} });
    }
    calculateResults(localFilterSpec, localOrderBy, localReverse, localSearchTerm) {
        var results = _.reduce(localFilterSpec, (result, value, key) => {
            result = _.filter(result, (o) => {
                return !_.isEmpty(_.intersection(value, o.tags[key]));
            });
            return result;
        }, this.globalData);
        var afacet = localOrderBy;
        var finalresults = (localReverse) ? _.reverse(_.sortBy(results, (a) => a.tags[afacet])) : _.sortBy(results, (a) => a.tags[afacet]);
        var searchResearchData = localSearchTerm.length == 0 ? finalresults : finalresults.filter((a) => _.startsWith(_.toLower(a.caption), _.toLower(localSearchTerm)));
        return (searchResearchData);
    }
    render() {
        return (React.createElement("div", null));
    }
}
