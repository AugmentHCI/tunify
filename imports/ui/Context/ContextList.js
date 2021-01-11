import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { LocalContext } from '/imports/api/data.js';
import ContextItem from '/imports/ui/Context/ContextItem.js';

import { List, AutoSizer } from 'react-virtualized';

class ContextList extends Component {

  constructor(props) {
    super(props);
    this._rowRenderer = this._rowRenderer.bind(this);
  }

  _rowRenderer({index, key, style}) {
    return <ContextItem key={key} ContextData={this.props.LocalContext[index]} style={style}/>;
  }

  render() {
    return (
        <List
        height={354}
        width={320}
        rowCount={this.props.LocalContext.length}
        rowHeight={72}
        rowRenderer={this._rowRenderer}
        />
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      LocalContext: LocalContext.find({}).fetch(),
    };
  })(ContextList);
