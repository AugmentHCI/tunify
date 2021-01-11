import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import './VisualTable.css';
import { SelectedContext, ContextColors, ContextParameters, ContextDictTotals, LocalContext } from '/imports/api/data.js';
import { Button, Tooltip } from 'antd';

const TooltipContent = (props) => {
  const data = LocalContext.findOne({_id: props.ctxId});
  let textTitle = '';
  _.forEach(data.titles, function(t){ if(t.lang == 'en') textTitle = t.value });
  return <div>
          <div>{textTitle}</div>
          <div>{data.categories}</div>
          <div>{props.count.toLocaleString() + " songs"}</div>
         </div>;
}


class VTBarchart extends Component {

  constructor(props) {
    super(props);
    this.state = { color: ContextColors[_.indexOf(props.GetSelectedContext, props.ctxId)]};
  }

  render() {
    let count = 0;
    if(this.props.GetContextDictTotals !== undefined) count = this.props.GetContextDictTotals;
    let width = (count/this.props.maxContextNumber)*100;
    if (width <= 0 || isNaN(width)) width = 0;
    let className   = 'VTBarchart';
    let outSettings = {width: '100px' };
    let inSettings  = {width: width + 'px', background:  'rgb('+this.state.color+')' }
    if(this.props.position == 'vertical') {
      className = 'VTBarchart-vertical';
      outSettings = {height: '100px' };
      inSettings  = {height: width + 'px', background:  'rgb('+this.state.color+')' }
    }
    console.log(width);
    return (
      <Tooltip title={<TooltipContent ctxId={this.props.ctxId} count={count} />} color={this.state.color}>
      <div className={className}>
      <div className='vt-barchart-out'  style={outSettings}>
        <div className='vt-barchart-in' style={inSettings}></div>
      </div>
      </div>
      </Tooltip>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      GetSelectedContext: SelectedContext.get(),
      GetContextDictTotals: ContextDictTotals.get(props.ctxId),
      maxContextNumber: Math.max.apply(Math, _.map(SelectedContext.get(), function(id){ return parseInt(ContextDictTotals.get(id)); }))
    };
  })(VTBarchart);
