import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { LocalContext } from '/imports/api/data.js';
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Checkbox, Select, Button, Tooltip, Input } from 'antd';
import './Parameters.css';

class Parameter extends Component {

  constructor(props) {
    super(props);
    this.state = { parameters: null };
  }

  selectRule(){

  }

  render() {
    // <div className='parameter-type' >{this.props.data.type} [{this.props.data.mode}]</div>
    return (
      <div className='parameter' style={this.props.style}>
      <Checkbox onChange={this.selectRule} checked >
      <div className='parameter-field'>{this.props.data.field}</div>
      </Checkbox>
      <div>
      <Tooltip title="View Details">
      <Button type="text" shape="circle"><EditOutlined /></Button>
      </Tooltip>
      <Tooltip title="Remove">
      <Button type="text" shape="circle" danger><CloseCircleOutlined /></Button>
      </Tooltip>
      </div>
      </div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {};
  })(Parameter);
