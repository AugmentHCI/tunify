import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import './VisualTable.css';
import { SelectedContext, ContextColors, ContextParameters, OpenDrawer, DetailsData, SelectedTableItems } from '/imports/api/data.js';
import { Button, Tooltip } from 'antd';

class VTDatapoint extends Component {

  constructor(props) {
    super(props);
    let query = this.getQuery(props.ctxId, props.field)
    this.state = { count: 0, query: query, ctxId: props.ctxId, field: props.field};
  }

  getQuery(ctxId, field){
    let dataPoint = ContextParameters.find({ 'ctxId': ctxId, 'field': field}).fetch();
    let query = null;
    if(!_.isEmpty(dataPoint) && dataPoint != undefined ) {
      if(dataPoint[0].mode == 'interval'  ) query = JSON.parse('{"'+dataPoint[0].field+'":{"$gte":'+parseInt(dataPoint[0].from)+',"$lte":'+parseInt(dataPoint[0].to)+'}}');
      if(dataPoint[0].mode == 'selection' ) {
        let values = [];
        _.forEach(dataPoint, function(dp){
          values.push(dp.value);
        });
        query = JSON.parse('{"'+dataPoint[0].field+'": {"$in":['+'"' + values.join('","') +'"]} }');
      }
    }
    return query;
  }

  componentDidMount(){
    const self = this;
    Meteor.call('countServerQuery', this.state.query, function(error, result) {
        self.setState({count: result});
    });
  }

  componentDidUpdate(prevProps) {
    const self = this;
    if (this.props.GetSelectedContext !== prevProps.GetSelectedContext) {
        let query  = this.getQuery(this.state.ctxId, this.state.field);
        Meteor.call('countServerQuery', this.state.query, function(error, result) {
          self.setState({count: result});
        });
    }
  }

  handleClick() {
    console.log({'field': this.props.field, 'ctxId': this.state.ctxId });
    // OpenDrawer.set(true);
    // const key = this.props.ctxId + "-" + this.props.field;
    // DetailsData.set(key, {'field': this.props.field, 'ctxId': this.props.ctxId } );
  }

  render() {
    let mode   = '';
    let values = [];
    const key = this.state.ctxId + "-" + this.state.field;
    let dataPoint = ContextParameters.find({ 'ctxId': this.state.ctxId, 'field': this.state.field }).fetch();
    _.forEach(dataPoint, function(n){
      if(n.mode == 'selection') {
        mode = "Selection";
        values.push(n.value);
      }
      if(n.mode == 'interval')  {
        mode = "Interval";
        values.push(n.from);
        values.push(n.to);
      }
    });
    let opacity = 1;
    if(this.state.count > 0 && this.state.count !== undefined) opacity = this.state.count/440306;
    if(opacity < 0.20 && opacity > 0.00) opacity = 0.20;

    let color = ContextColors[_.indexOf(this.props.GetSelectedContext, this.state.ctxId)];

    if(this.state.count == 0 ) {
      return null;
    } else {
      let shadow = 'none';
      let rgbColor = 'rgba('+color+','+opacity+')';
      if(_.includes(this.props.GetSelectedTableItems, key)) shadow = 'rgba(79, 129, 255,0.8) 0px 0px 6px 3px';
      return (
        <Tooltip title={
          <div>
          <div>{this.state.field + ": " + this.state.count.toLocaleString() + " songs"}</div>
          <div>{mode}: {String(values)}</div>
          </div>
          } color={this.state.color}>
          <div className='VTDatapoint' onClick={() => this.handleClick()} style={{ boxShadow: shadow, background: rgbColor }}></div>
        </Tooltip>
      );
    }
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      GetDetailsData: DetailsData.all(),
      GetSelectedContext: SelectedContext.get(),
      GetSelectedTableItems: SelectedTableItems.get(),
    };
  })(VTDatapoint);
