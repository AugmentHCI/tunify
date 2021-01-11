import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Songs, LocalContext, SelectedContext, OpenDrawer, SelectedTableItems, TableOrientation } from '/imports/api/data.js';
import { Drawer, Button, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import DrawerVisuals from '/imports/ui/DetailsDrawer/DrawerVisuals.js'
import DataDrop     from '/imports/ui/Toolbar/DataDrop.js';
import SongsTable   from '/imports/ui/MusicTable/SongsTable.js';
import ParametersContainer from '/imports/ui/Parameters/ParametersContainer.js';
import ContextList from '/imports/ui/Context/ContextList.js';
import { FileAddOutlined, CopyOutlined, DiffOutlined, RightOutlined, LeftOutlined, RotateLeftOutlined, CaretRightOutlined, CaretDownOutlined, } from '@ant-design/icons';
import VisualTable from '/imports/ui/Visualization/VisualTable.js'
class App extends Component {

  constructor(props) {
   super(props);
   this.state = {
     drawerOpen: false,
     drawerSize: '40px',
     topContainerHeight: '320px', //34px
   };
  }

  componentDidMount() {
    Meteor.subscribe('songs');
  }

  flipTable() {
    if(this.props.GetTableOrientation == 'vertical') TableOrientation.set('horizontal');
    if(this.props.GetTableOrientation == 'horizontal') TableOrientation.set('vertical');
  }

  onCloseDrawer() {

  }

  handleDrawer() {
    if(this.props.GetOpenDrawer) {
      OpenDrawer.set(false);
    } else {
      OpenDrawer.set(true);
    }
  }

  topContainerHeight() {
    if(this.state.topContainerHeight == '320px') this.setState({topContainerHeight:  '34px'});
    if(this.state.topContainerHeight ==  '34px') this.setState({topContainerHeight: '320px'});
  }


  render() {
    let drawerSize = '40px';
    if(this.props.GetOpenDrawer) drawerSize = '560px';
    const editorStyle = { fontSize: '12px', margin: '0px 4px 0px 4px', color: '#1890ff' };
    return (
      <React.Fragment>
        <div className='main-app-container'>
          <div className='app-toolbar'>
            <img src="tunify.svg" alt="Tunify" />
            <Button icon={<FileAddOutlined />}>New</Button>
            <DataDrop   />
          </div>
          { _.isEmpty(this.props.LocalContext) ? null :
            <div className='rules-container' style={{ height: this.state.topContainerHeight}}>
              <div className='collapse-bar'>
              <Button type="text" size='small' onClick={() => this.topContainerHeight()} icon={this.state.topContainerHeight == '320px' ? <CaretDownOutlined style={editorStyle} /> : <CaretRightOutlined style={editorStyle} />}>Context Editor</Button>
              </div>
              <div style={{display: 'flex'}}>
              { _.isEmpty(this.props.LocalContext)       ? null : <div className='database-container'><ContextList /></div> }
              { _.isEmpty(this.props.GetSelectedContext) ? null : _.map(this.props.GetSelectedContext, function(n,i){ return <ParametersContainer key={i} contextId={n} />; }) }
              </div>
            </div>
          }

          { _.isEmpty(this.props.GetSelectedContext) ? null :
            <div style={{ flex: '1 1 auto', position: "relative" }}>
            <Button className='flip-button' icon={<RotateLeftOutlined />} onClick={() => this.flipTable()} />
            <VisualTable />
            </div>
          }
        </div>
      <div className="app-details-drawer" style={{width: drawerSize}}>
        <div className="drawer-nav"><Button type="text" size="large" onClick={() => this.handleDrawer()} icon={this.props.GetOpenDrawer ? <RightOutlined /> : <LeftOutlined />} /></div>
        {_.isEmpty(this.props.GetSelectedTableItems) ? null :
        <div className="drawer-contents">
        <DrawerVisuals />
        <div style={{ flex: '1 1 auto', position: "relative" }}>
          <SongsTable />
        </div>
        </div>
        }
      </div>
      </React.Fragment>
    );
  }
}

export default withTracker((props) => {
  return {
    GetTableOrientation: TableOrientation.get(),
    GetSelectedTableItems: SelectedTableItems.get(),
    GetOpenDrawer: OpenDrawer.get(),
    LocalContext: LocalContext.find({}).fetch(),
    GetSelectedContext: SelectedContext.get()
  };
})(App);
