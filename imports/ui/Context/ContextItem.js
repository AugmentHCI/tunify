import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { LocalContext, SelectedContext, ContextColors, ContextParameters, ContextDictTotals, VisualTableHeaders, TableFullContexts, ExpandedContexts } from '/imports/api/data.js';
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Checkbox, Button, Tooltip } from 'antd';
import './ContextItem.css';

class ContextItem extends Component {

  constructor(props) {
    super(props)
    this.state = { totalSongs: 0};
  }

  getEnglishTitle(){
    const data    = this.props.ContextData;
    let textTitle = '';
    _.forEach(data.titles, function(title){
      if(title.lang == 'en') textTitle = title.value
    });
    return textTitle;
  }

  updateTableHeaders(List){
    const vtHeaders = _.map(List, function(n){
      const ctx = LocalContext.findOne({_id: n});
      const subcontextSelection = _.flatten(_.map( ctx.subcontexts, function(sc){ return sc.selection }));
      const subcontextInterval  = _.flatten(_.map( ctx.subcontexts, function(sc){ return sc.interval  }));
      const rules = _.concat(ctx.tweakable.selection, ctx.tweakable.interval, subcontextSelection, subcontextInterval);
      return(_.uniq(_.map(rules, function(n) { return n.field})));
    });
    VisualTableHeaders.set(_.uniq(_.flatten(vtHeaders)).sort());
  }

  generateAllSongsQuery(ctxId){
    let dataPointListSelection = ContextParameters.find({ 'ctxId': ctxId, 'mode': 'selection'}).fetch();
    let dataPointListInterval  = ContextParameters.find({ 'ctxId': ctxId, 'mode': 'interval' }).fetch();
    let intervalList  = [];
    let selectionList = [];
      _.forEach(dataPointListInterval, function(dataPoint){
          intervalList.push(dataPoint.field+'":{"$gte":'+parseInt(dataPoint.from)+',"$lte":'+parseInt(dataPoint.to)+'}');
        });

      _.forEach(_.uniq(_.map(dataPointListSelection, 'field')), function(field){
        let values = _.map(_.filter(dataPointListSelection, { 'field': field }), 'value');
        selectionList.push(field+'": {"$in":['+'"' + values.join('","') +'"]}');
      });
    return ('{"' + _.flatten([intervalList, selectionList]).join(',"') + '}');
  }

  selectContext = e => {
    const ExpandedContexts = this.props.GetExpandedContexts
    const contextID        = this.props.ContextData._id;
    let   selectedList     = this.props.GetSelectedContext;
    if(_.includes(this.props.GetSelectedContext, this.props.ContextData._id)) {
      // Remove me from the List
      let uniqSelectedList = _.uniq(_.pull(selectedList, contextID));
      SelectedContext.set(uniqSelectedList);
      this.updateTableHeaders(uniqSelectedList);
    } else {
      // Add me to the list
      selectedList.push(contextID);
      let uniqSelectedList = _.uniq(selectedList);
      SelectedContext.set(uniqSelectedList);

      if(_.isEmpty(ExpandedContexts)) {
        TableFullContexts.set(_.map(uniqSelectedList, function(n) { return { id: n, type: 'context' }}));
      } else {
        const TableOutput = [];
        _.forEach(uniqSelectedList, function(ctx){
          if(_.includes(ExpandedContexts, ctx)){
            TableOutput.push({ id: ctx, type: 'context' })
            _.forEach(LocalContext.findOne({_id: ctx}).subcontexts, function(n){
              TableOutput.push({id: ctx, type: 'subcontext', name: n.name});
            });
          } else {
            TableOutput.push({ id: ctx, type: 'context' })
          }
        });
        TableFullContexts.set(TableOutput);
      }

      this.updateTableHeaders(uniqSelectedList);

      this.countSongs(JSON.parse(this.generateAllSongsQuery(contextID)));
    }
  }

  countSongs(query) {
    const self = this;
    Meteor.call('countServerQuery', query, function(error, result) {
      self.setState({totalSongs: result});
      ContextDictTotals.set(self.props.ContextData._id, result);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.GetSelectedContext !== this.props.GetSelectedContext) {;
      this.setState({color: ContextColors[_.indexOf(this.props.GetSelectedContext, this.props.ContextData._id)]});
    }
  }

  render() {
    let checked = false;
    if(_.includes(this.props.GetSelectedContext, this.props.ContextData._id)) checked = true;
    return (
      <div className='contextItem' style={this.props.style}>
      <Checkbox onChange={this.selectContext} checked={checked} >
      <div className='context-title'   style={{color: 'rgb('+this.state.color+')' }}>{this.getEnglishTitle()} {checked ?  <span>{this.state.totalSongs.toLocaleString() + " songs"}</span> : null}</div>
      <div className='context-category'>{this.props.ContextData.categories}</div>
      </Checkbox>
      <div>
      <Tooltip title="View Details">
      <Button type="text" shape="circle"><EditOutlined /></Button>
      </Tooltip>
      <Tooltip title="Remove">
      <Button danger type="link" shape="circle" icon={<CloseCircleOutlined key="close" />} />
      </Tooltip>
      </div>
      </div>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      GetExpandedContexts: ExpandedContexts.get(),
      GetSelectedContext: SelectedContext.get(),
      GetVisualTableHeaders: VisualTableHeaders.get(),
    };
  })(ContextItem);
