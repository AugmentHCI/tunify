import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { LocalContext } from '/imports/api/data.js';
import { Card } from 'antd';
import { EditOutlined, CloseCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { Select, Button, Tooltip, Input, Checkbox } from 'antd';
import './Parameters.css';
const { Meta } = Card;
import { PlusOutlined } from '@ant-design/icons';

class ParametersView extends Component {

  constructor(props) {
    super(props);
    this.state = { parameters: null };
  }

  componentDidMount() {
    Meteor.call('load.parameters', (error, result) => {
      this.setState({parameters: result});
    });
  }

  onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  render() {
    let parameters = this.state.parameters;
    let list = [];
    if(parameters != null) {
      list = _.map(Object.keys(parameters), function(param,i){
        return <Select.Option key={i+"select"} value={param}>{param}</Select.Option>;
      });
    }
    return (
      <div className='parameters-view'>
      <h1>Add Parameter</h1>
      <div className='parameter-edit-container'>
      <Select>
        {list}
      </Select>
      <Input placeholder="Parameter value" />
      <Checkbox onChange={this.onChange}>Tweakable?</Checkbox>
      <Tooltip title="Add new parameter">
      <Button type="primary" shape="circle" icon={<PlusOutlined />} />
      </Tooltip>
      </div>
      </div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {};
  })(ParametersView);
