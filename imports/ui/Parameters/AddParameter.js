import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { LocalContext } from '/imports/api/data.js';
import { Radio, Card } from 'antd';
import { Select, Button, Tooltip, Input, Checkbox } from 'antd';
import './Parameters.css';
const { Meta } = Card;
import { PlusOutlined } from '@ant-design/icons';

class AddParameter extends Component {

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
      <div className='parameter-edit-container'>
      <Select placeholder="Add a new rule..."> {list} </Select>
      <Radio.Group buttonStyle="solid">
      <Radio.Button value={1}>Selection</Radio.Button>
      <Radio.Button value={2}>Interval</Radio.Button>
      </Radio.Group>
      <Checkbox onChange={this.onChange}>Tweakable?</Checkbox>
      </div>
      </div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {};
  })(AddParameter);
