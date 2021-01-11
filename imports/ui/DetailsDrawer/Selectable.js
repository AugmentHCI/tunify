import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class Selectable extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='DrawerVisuals' style={{width: '100px', height: '100px', margin: '4px', background: 'blue'}}></div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {};
  })(Selectable);
