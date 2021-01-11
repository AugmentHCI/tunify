import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SelectedContext, ContextColors, SelectedTableItems, ContextParameters } from '/imports/api/data.js';

import IntervalChart  from './IntervalChart.js';
import SelectionChart from './SelectionChart.js';
import Selectable     from './Selectable.js';

import { SelectableGroup, createSelectable } from 'react-selectable';

const SelectableComponent = createSelectable(Selectable);


class DrawerVisuals extends Component {

  constructor(props) {
    super(props);
    this.state = {visualizationData: null}
  }

  componentDidUpdate(prevProps){
    if(prevProps.GetSelectedTableItems !== this.props.GetSelectedTableItems) {
      const SelectedItems   = this.props.GetSelectedTableItems;
      const ParametersList  = _.map(SelectedItems,  function(n) { return {ctxId: n.split('-')[0], field: n.split('-')[1]} });
      const QueryResults    = _.map(ParametersList, function(i) { return ContextParameters.find(i).fetch(); });
      // console.log(_.groupBy(QueryResults, 'ctx'));
      // console.log(_.groupBy(QueryResults, 'field'));
      // if mode == selection
      // _.forEach(QueryResults, function(n){
      //   console.log(n);
      // });
      // "Mood": ["NA","Mixed","Relax","Peaceful","Social","Bright","Dynamic","Exuberant"]
      this.setState({visualizationData: _.flatten(QueryResults)})
    }
  }

  render() {
    let visualisation = null;
    if(this.state.visualizationData !== null) {
      visualisation = <SelectionChart VisualizationData = {this.state.VisualizationData}/>
    }
    return (
      <div>{visualisation}</div>
    );
  } // end of render
} // end of class

export default withTracker((props) => {
  return {
    GetSelectedTableItems: SelectedTableItems.get()
    // GetKeysDetailsData: DetailsData.keys()
  };
})(DrawerVisuals);
