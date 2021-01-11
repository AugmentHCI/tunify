import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modal, Checkbox, Select, Button, Tooltip, Input } from 'antd';
import { List, AutoSizer } from 'react-virtualized';
import AddParameter      from './AddParameter.js'
import Parameter         from './Parameter.js'
import './Parameters.css';
import { LocalContext, SelectedContext, ContextColors } from '/imports/api/data.js';
import { FileAddOutlined, CaretRightOutlined, CaretDownOutlined    } from '@ant-design/icons';

const Subcontext = (props) => {
  // You can use Hooks here!
  return <div className='subcontext-container'>
         <Button type="text" size='small' icon={<CaretRightOutlined style={{ fontSize: '12px', margin: '0px 4px 0px 4px', color: '#1890ff' }}  />}>{props.name}</Button>
         </div>;
}

class ParametersContainer extends Component {

  constructor(props) {
    super(props);
    const subcontextSelection =_.flatten(_.map( this.props.LocalContext.subcontexts, function(sc){ return sc.selection }));
    const subcontextInterval  =_.flatten(_.map( this.props.LocalContext.subcontexts, function(sc){ return sc.interval  }));
    let rules = _.concat(this.props.LocalContext.tweakable.selection, this.props.LocalContext.tweakable.interval, subcontextSelection, subcontextInterval);
    this.state = {
      nodes: _.groupBy(rules, 'ctxName'),
      selectedNode: null,
      rules: rules,
      modalVisible: false,
      color: ContextColors[_.indexOf(props.GetSelectedContext, props.LocalContext._id)]
    };
    this._subcontextRenderer = this._subcontextRenderer.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
  }

  getEnglishTitle(){
    const data    = this.props.LocalContext;
    let textTitle = '';
    _.forEach(data.titles, function(title){
      if(title.lang == 'en') textTitle = title.value
    });
    return textTitle;
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  _subcontextRenderer({index, isScrolling, key, style}) {
    let subcontexts = Object.keys(this.state.nodes).sort();
    subcontexts = subcontexts.filter(item => item !== 'Tweakable Rules');
    subcontexts.unshift('Tweakable Rules');
    return <div key={key} style={style}><Subcontext name={subcontexts[index]}/></div>
  }

  _rowRenderer({index, isScrolling, key, style}) {
    const rules = _.orderBy(this.state.rules, 'field');
    return <Parameter key={key} data={rules[index]} style={style}/>;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.GetSelectedContext !== this.props.GetSelectedContext) {
      this.setState({color: ContextColors[_.indexOf(this.props.GetSelectedContext, this.props.LocalContext._id)]});
      const subcontextSelection =_.flatten(_.map( this.props.LocalContext.subcontexts, function(sc){ return sc.selection }));
      const subcontextInterval  =_.flatten(_.map( this.props.LocalContext.subcontexts, function(sc){ return sc.interval  }));
      this.setState({rules: _.concat(this.props.LocalContext.tweakable.selection, this.props.LocalContext.tweakable.interval, subcontextSelection, subcontextInterval)});
    }
  }

  render() {
    return (
      <div className="parameters-container">
      <div className="parameters-actions">
      <Checkbox checked><div style={{color: 'rgb('+this.state.color+')'}}>{this.getEnglishTitle()}</div></Checkbox>
      <Button type="link" onClick={() => this.setModalVisible(true)}>add subcontext</Button>
      <Modal
      centered
      width={600}
      title={this.getEnglishTitle()}
      visible={this.state.modalVisible}
      footer={[
        <Button key="back" onClick={() => this.setModalVisible(false)}>
        Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.setModalVisible(false)}>
        Add Rule
        </Button>,
      ]}
      >
      <AddParameter />
      </Modal>
      </div>
      <div className="parameters-list">
        <List
        height={320}
        rowCount={Object.values(this.state.nodes).length}
        rowHeight={48}
        rowRenderer={this._subcontextRenderer}
        width={320}
        />
      </div>
      </div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      LocalContext: LocalContext.findOne({_id: props.contextId }),
      GetSelectedContext: SelectedContext.get()
    };
  })(ParametersContainer);
