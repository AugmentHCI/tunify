import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import './VisualTable.css';
import { SelectedContext, ContextColors, ExpandedContexts } from '/imports/api/data.js';
import { Button } from 'antd';
import { NodeExpandOutlined } from '@ant-design/icons';

class VTSubcontext extends Component {

  constructor(props) {
    super(props);
    this.state = { color: ContextColors[_.indexOf(props.GetSelectedContext, props.ctx._id)], open: false};
  }

  contextSelection(){
  }

  getEnglishTitle(){
    const data    = this.props.ctx;
    let textTitle = '';
    _.forEach(data.titles, function(title){
      if(title.lang == 'en') textTitle = title.value
    });
    return textTitle;
  }

  render() {
    //if(this.props.ctx.subcontexts.length > 1)
    const style = { fontSize: '12px', margin: '0px 16px', color: '#636363' };
    return (
      <Button type="text" size='small'
      onClick={() => this.contextSelection()} icon={<NodeExpandOutlined style={style} /> }>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
      <div className='title' style={{color: 'rgb('+this.state.color+')', opacity: 0.6, fontSize: '11px', fontWeight: 600 }} >{this.props.name}</div>
      </div>
      </Button>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      GetExpandedContexts: ExpandedContexts.get(),
      GetSelectedContext: SelectedContext.get()
    };
  })(VTSubcontext);
