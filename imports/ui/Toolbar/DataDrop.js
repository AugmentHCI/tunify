import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Dropzone from 'react-dropzone'
import './DataDrop.css';
import { Spin, Tooltip, Button } from 'antd';
import 'antd/dist/antd.css';
import { LocalContext, ContextParameters } from '/imports/api/data.js';

import { UploadOutlined } from '@ant-design/icons';

class DataDrop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileName: "",
      fileSize: 0,
      isDataReady: false,
      isDataLoading: false,
      numRows: 0,
    };
    // this.createContextParameters = this.createContextParameters.bind(this);
  }

  createContextParameters(ctx, id) {
    const subcontextSelection = _.map( ctx.subcontexts, function(sc){ return sc.selection });
    const subcontextInterval  = _.map( ctx.subcontexts, function(sc){ return sc.interval  });
    const rules    = _.concat(ctx.tweakable.selection, ctx.tweakable.interval, _.flatten(subcontextSelection), _.flatten(subcontextInterval));
    const allRules = _.map(rules, function(n) {
      if(n.mode == 'selection') {
        let tmp = _.map(n.values, function(v) {
          let name = null;
          ContextParameters.insert({ctx: ctx.categories, field: n.field, value: v, mode: 'selection', ctxId:  id, type: n.type, ctxName: name});
        });
      }
      if(n.mode == 'interval') {
        let name = null;
        ContextParameters.insert({ctx: ctx.categories, field: n.field, from: n.from, to: n.to, mode: 'interval', ctxId: id, type: n.type, ctxName: name});
      }
    });
  }

  processFiles(acceptedFiles) {
    const self = this;
    _.forEach(acceptedFiles, function(file) {
      const reader = new FileReader();
      reader.onload = () => {
        Meteor.call('load.data', reader.result, (error, ctx) => {
          LocalContext.insert(ctx, function(error, id){
              self.createContextParameters(ctx, id);
          });
        });
      }
      reader.readAsBinaryString(file);
    });
  }

  render() {
    return(<Spin spinning={this.state.isDataLoading}>
    <Dropzone onDrop={acceptedFiles => this.processFiles(acceptedFiles)}>
      {({getRootProps, getInputProps}) => (
        <section className="dd-content">
        <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Button icon={<UploadOutlined />}>Load</Button>
        </div>
        </section>
      )}
    </Dropzone>
    </Spin>);
    } // end of render
  } // end of class

  export default withTracker((props) => {
    return {
      a:"abc",
    };
  })(DataDrop);
