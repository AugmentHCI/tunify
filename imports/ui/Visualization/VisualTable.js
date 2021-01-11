import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Songs, TableFullContexts, SelectedContext, LocalContext, VisualTableHeaders, SelectedTableItems, OpenDrawer, TableOrientation, ExpandedContexts } from '/imports/api/data.js';
import { MultiGrid, AutoSizer } from 'react-virtualized';
import VTHeader      from './VTHeader.js'
import VTContext     from './VTContext.js'
import VTSubcontext  from './VTSubcontext.js'
import VTFirstColumn from './VTFirstColumn.js'
import VTDatapoint   from './VTDatapoint.js'
import VTBarchart    from './VTBarchart.js'
import './VisualTable.css';

import { SelectableGroup, createSelectable } from 'react-selectable';
const SelectableVTDatapoint = createSelectable(VTDatapoint);

class VisualTable extends Component {

  constructor(props) {
    super(props);
    this.columnSize = this.columnSize.bind(this);
    this.rowSize    = this.rowSize.bind(this);
    this.cellHorizontalRenderer = this.cellHorizontalRenderer.bind(this);
    this.cellVerticalRenderer   = this.cellVerticalRenderer.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  cellHorizontalRenderer ({ columnIndex, key, rowIndex, style }) {
    let content   = '';
    let className = '';
    if(rowIndex == 0 && columnIndex >  0 ) content = <VTHeader  param={this.props.GetVisualTableHeaders[columnIndex - 1]} />;
    if(rowIndex  > 0 && columnIndex == 0 ) {
      const contextFC = this.props.GetTableFullContexts[rowIndex - 1];
      if(this.props.GetTableFullContexts[rowIndex - 1].type == 'context' ){
        className = 'VTFirstColumn';
        content = <VTContext  ctx={LocalContext.findOne({_id: contextFC.id })} />;
      } else {
        className = 'VTFirstColumnSubcontext';
        content   = <VTSubcontext ctx={LocalContext.findOne({_id: contextFC.id })} name={contextFC.name} />;
      }
    }
    if(rowIndex  > 0 && columnIndex >  0 ) {
      if(columnIndex !==  (this.props.GetVisualTableHeaders.length + 1)) {
        let field = this.props.GetVisualTableHeaders[columnIndex - 1];
        let slKey = this.props.GetTableFullContexts[rowIndex - 1].id+'-'+field;
        let item  = this.props.GetTableFullContexts[rowIndex - 1];
        className = 'VTDatapointContainer';
        content = <SelectableVTDatapoint key={key+"i"} type={item.type} ctxId = {item.id} name={item.name} field = {field} selectableKey={slKey} />;
      }
    }
    // Barchart at the end.
    if(rowIndex == 0 && columnIndex ==  (this.props.GetVisualTableHeaders.length + 1) ) content = '';
    if(rowIndex  > 0 && columnIndex ==  (this.props.GetVisualTableHeaders.length + 1) ) {
      className = 'VTBarchartContainer';
      content = <VTBarchart ctxId = {this.props.GetTableFullContexts[rowIndex - 1].id} />;
    }
    return (<div key={key} className={className} style={style}>{content}</div>);
  }

  cellVerticalRenderer ({ columnIndex, key, rowIndex, style }) {
    let content   = '';
    let className = '';
    const ctxId   = this.props.GetTableFullContexts[columnIndex - 1].id;
    if(rowIndex == 0 && columnIndex >  0 ) {
      className='vert-barchart';
      content = <VTBarchart ctxId = {this.props.GetTableFullContexts[columnIndex-1].id} position='vertical'/>;
    }
    if(rowIndex  > 0 && columnIndex == 0 ) content = <VTHeader  position='vertical' param={this.props.GetVisualTableHeaders[rowIndex - 1]} />;
    // Render the dots
    if(rowIndex  > 0 && columnIndex >  0 ) {
      if(columnIndex !==  (this.props.GetVisualTableHeaders.length + 1)) {
        let field = this.props.GetVisualTableHeaders[rowIndex - 1];
        let selectedKey = ctxId+'-'+field;
        className = 'VTDatapointContainer';
        content = <SelectableVTDatapoint key={key+"i"} ctxId = {ctxId} field = {field} selectableKey={selectedKey} />;
      }
    }
    return (<div key={key} className={className} style={style}>{content}</div>);
  }

  handleSelection (selectedKeys) {
    SelectedTableItems.set(selectedKeys);
    OpenDrawer.set(true);
    this._grid.recomputeGridSize();
    this._grid.forceUpdateGrids();
    this._grid.forceUpdate();
    this.forceUpdate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.GetTableFullContexts.length !== prevProps.GetTableFullContexts.length) {
      this._grid.recomputeGridSize();
      this._grid.forceUpdateGrids();
      this._grid.forceUpdate();
      this.forceUpdate();
    }
  }


  columnSize({index}) {
    switch (index) {
      case 0:  return 240;  // Song id
      default: return 32;   // 32
    }
  }

  rowSize({index}) {
    if( this.props.TableOrientation == 'vertical')  {
      switch (index) {
        case 0:  return 120; // Header
        default: return 32;
      }
    } else {
      switch (index) {
        case 0:  return 80; // Header
        default: return 32;
      }
    }
  }

  render() {
    let columnCount  = 0;
    let rowCount     = 0;
    let cellRenderer = null;
    if(this.props.TableOrientation == 'horizontal') {
      columnCount = this.props.GetVisualTableHeaders.length + 2;
      rowCount    = this.props.GetTableFullContexts.length  + 1;
      cellRenderer = this.cellHorizontalRenderer;
    } else if (this.props.TableOrientation == 'vertical') {
      columnCount  = this.props.GetTableFullContexts.length  + 1;
      rowCount     = this.props.GetVisualTableHeaders.length + 1;
      cellRenderer = this.cellVerticalRenderer
    }

    return (
        <React.Fragment>
        <AutoSizer>
        {({height, width}) => (
          <SelectableGroup onSelection={this.handleSelection}>
          <MultiGrid
          {...this.props}
          fixedColumnCount = {1}
          fixedRowCount    = {1}
          cellRenderer     = {cellRenderer}
          height           = {height}
          width            = {width}
          columnCount      = {columnCount}
          rowCount         = {rowCount   }
          columnWidth      = {this.columnSize}
          rowHeight        = {this.rowSize}
          ref              = {(ref) => this._grid = ref}
          enableFixedColumnScroll
          />
          </SelectableGroup>
        )}
        </AutoSizer>
        </React.Fragment>
    );
  } // end of render
} // end of class

  export default withTracker((props) => {

    if(_.isEmpty(ExpandedContexts.get())) {
      TableFullContexts.set(_.map(SelectedContext.get(), function(n) { return { id: n, type: 'context' }}));
    } else {
      const TableOutput = [];
      _.forEach(SelectedContext.get(), function(ctx){
        if(_.includes(ExpandedContexts.get(), ctx)){
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


    return {
      GetExpandedContexts: ExpandedContexts.get(),
      GetSelectedContext: SelectedContext.get(),
      TableOrientation: TableOrientation.get(),
      GetTableFullContexts: TableFullContexts.get(),
      GetVisualTableHeaders: VisualTableHeaders.get(),
      GetSelectedTableItem: SelectedTableItems.get()
    };
  })(VisualTable);
