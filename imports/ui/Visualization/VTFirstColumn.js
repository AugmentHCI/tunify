import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import './VisualTable.css';
import { SelectedContext, ContextColors } from '/imports/api/data.js';

class VTFirstColumn extends Component {

  constructor(props) {
    super(props);
    this.state = { color: ContextColors[_.indexOf(props.GetSelectedContext, props.param.ctxId)]};
  }

  render() {
    return (
      <div className='VTFirstColumn'>
      <div className='title' style={{color: 'rgb('+this.state.color+')' }} >{this.props.param.ctx}  </div>
      <div className='subtitle'>
      {this.props.param.field}&nbsp;-&nbsp;
      { this.props.param.mode == 'selection' ?  this.props.param.value : this.props.param.from + ' - ' + this.props.param.to }
      </div>
      </div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      GetSelectedContext: SelectedContext.get()
    };
  })(VTFirstColumn);
