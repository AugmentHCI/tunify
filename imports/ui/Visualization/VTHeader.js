import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import './VisualTable.css';

class VTHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let className = 'VTHeader';
    if(this.props.position == 'vertical') {
      className = 'VTHeader-vertical';
    }
    return (
      <div className={className}><h1>{this.props.param}</h1></div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {};
  })(VTHeader);
