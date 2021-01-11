import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import './VisualTable.css';
import { SelectedContext, ContextColors, ExpandedContexts } from '/imports/api/data.js';
import { Button } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';

class VTContext extends Component {

  constructor(props) {
    super(props);
    this.state = { color: ContextColors[_.indexOf(props.GetSelectedContext, props.ctx._id)], open: false};
  }

  contextSelection(){
    const CurrentExpandedContexts = this.props.GetExpandedContexts;
    if(this.state.open) {
      this.setState({open: false });
      ExpandedContexts.set(_.pull(CurrentExpandedContexts, this.props.ctx._id));
    } else {
      this.setState({open: true  });
      CurrentExpandedContexts.push(this.props.ctx._id);
      ExpandedContexts.set(_.uniq(CurrentExpandedContexts));
    }
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
    const style = { fontSize: '12px', margin: '0px 16px', color: '#1890ff' };
    return (
      <Button type="text" size='small'
      onClick={() => this.contextSelection()} icon={this.state.open ?   <CaretDownOutlined style={style} /> : <CaretRightOutlined style={style} /> }>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
      <div className='title' style={{color: 'rgb('+this.state.color+')' }} >{this.getEnglishTitle()}  </div>
      <div className='subtitle'>{this.props.ctx.categories}</div>
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
  })(VTContext);
