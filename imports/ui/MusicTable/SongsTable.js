import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Songs } from '/imports/api/data.js';
import { MultiGrid, AutoSizer } from 'react-virtualized';
import './SongsTable.css';
class SongsTable extends Component {

  constructor(props) {
    super(props);
    this.columnSize   = this.columnSize.bind(this);
    this.rowSize      = this.rowSize.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
  }

  cellRenderer ({ columnIndex, key, rowIndex, style }) {
    let content;
    const S = this.props.Songs;
    let className  = "vg-cell ";
    if (rowIndex     === 0 ) {
      className += "vg-header ";
      if(columnIndex == 0)  content = 'group';
      if(columnIndex == 1)  content = 'title';
      // if(columnIndex == 0)  content = 'id';
      // if(columnIndex == 1)  content = 'group';
      if(columnIndex == 2)  content = 'title';
      if(columnIndex == 3)  content = 'BPM';
      if(columnIndex == 4)  content = 'year';
      if(columnIndex == 5)  content = 'Origin';
      if(columnIndex == 6)  content = 'Theme';
      if(columnIndex == 7)  content = 'Voice';
      if(columnIndex == 8)  content = 'Version';
      if(columnIndex == 9)  content = 'Continent';
      if(columnIndex == 10) content = 'Language';
      if(columnIndex == 11) content = 'Danceability';
      if(columnIndex == 12) content = 'Dancing Style';
      if(columnIndex == 13) content = 'Mood';
      if(columnIndex == 14) content = 'Emotion';
      if(columnIndex == 15) content = 'Energy';
      if(columnIndex == 16) content = 'Metadata';
      if(columnIndex == 17) content = 'duration';
      if(columnIndex == 18) content = 'Decade';
      if(columnIndex == 19) content = 'Parental Advisory';
      if(columnIndex == 20) content = 'Party Level';
      if(columnIndex == 21) content = 'duration-search';
      if(columnIndex == 22) content = 'Music Perception';
      if(columnIndex == 23) content = 'Music Feel';
      if(columnIndex == 24) content = 'Music Rhythm';
      if(columnIndex == 25) content = 'Music Style';
      if(columnIndex == 26) content = 'Music Trend';
      if(columnIndex == 27) content = 'Music Type';
      if(columnIndex == 28) content = 'Inst. Accompaniment';
      if(columnIndex == 29) content = 'Audio Type';
      if(columnIndex == 30) content = 'Compilation';
      if(columnIndex == 31) content = 'Instrument';
      if(columnIndex == 32) content = 'Occasion';
      if(columnIndex == 33) content = 'Performance';
      if(columnIndex == 34) content = 'Perf. Rights';
      if(columnIndex == 35) content = 'Period';
      if(columnIndex == 36) content = 'Substyle';
      if(columnIndex == 37) content = 'Target Region';
      if(columnIndex == 38) content = 'Topicality';
      if(columnIndex == 39) content = 'Version';
      if(columnIndex == 40) content = 'Vocal Style';
      if(columnIndex == 41) content = 'Composer';
      if(columnIndex == 42) content = 'Region Code';
    }
    if (rowIndex % 2 !== 0 ) className += "vg-odd ";
    try {
      if(rowIndex > 0){
        // if(columnIndex == 0)  content = S[rowIndex]['song-id'];
        if(columnIndex == 0)  content = String(S[rowIndex].group).length > 20 ? S[rowIndex].group.slice(0, 20) + '...' : S[rowIndex].group;
        if(columnIndex == 1)  content = String(S[rowIndex].title).length > 20 ? S[rowIndex].title.slice(0, 20) + '...' : S[rowIndex].title;
        // if(columnIndex == 2)  content = S[rowIndex].title;
        if(columnIndex == 3)  content = S[rowIndex].BPM;
        if(columnIndex == 4)  content = S[rowIndex].year;
        if(columnIndex == 5)  content = S[rowIndex].Origin;
        if(columnIndex == 6)  content = S[rowIndex].Theme;
        if(columnIndex == 7)  content = S[rowIndex].Voice;
        if(columnIndex == 8)  content = S[rowIndex].Version;
        if(columnIndex == 9)  content = S[rowIndex].Continent;
        if(columnIndex == 10) content = S[rowIndex].Language;
        if(columnIndex == 11) content = S[rowIndex].Danceability;
        if(columnIndex == 12) content = S[rowIndex]['Dancing Style'];
        if(columnIndex == 13) content = S[rowIndex].Mood;
        if(columnIndex == 14) content = S[rowIndex].Emotion;
        if(columnIndex == 15) content = S[rowIndex].Energy;
        if(columnIndex == 16) content = S[rowIndex].Metadata;
        if(columnIndex == 17) content = S[rowIndex].duration;
        if(columnIndex == 18) content = S[rowIndex].Decade;
        if(columnIndex == 19) content = S[rowIndex]['Parental Advisory'];
        if(columnIndex == 20) content = S[rowIndex]['Party Level'];
        if(columnIndex == 21) content = S[rowIndex]['duration-search'];
        if(columnIndex == 22) content = S[rowIndex]['Music Perception'];
        if(columnIndex == 23) content = S[rowIndex]['Music Feel'];
        if(columnIndex == 24) content = S[rowIndex]['Music Rhythm'];
        if(columnIndex == 25) content = S[rowIndex]['Music Style'];
        if(columnIndex == 26) content = S[rowIndex]['Music Trend'];
        if(columnIndex == 27) content = S[rowIndex]['Music Type'];
        if(columnIndex == 28) content = S[rowIndex]['Instrumental Accompaniment'];
        if(columnIndex == 29) content = S[rowIndex]['Audio Type'];
        if(columnIndex == 30) content = S[rowIndex]['Compilation'];
        if(columnIndex == 31) content = S[rowIndex]['Instrument'];
        if(columnIndex == 32) content = S[rowIndex]['Occasion'];
        if(columnIndex == 33) content = S[rowIndex]['Performance'];
        if(columnIndex == 34) content = S[rowIndex]['Performance Rights'];
        if(columnIndex == 35) content = S[rowIndex]['Period'];
        if(columnIndex == 36) content = S[rowIndex]['Substyle'];
        if(columnIndex == 37) content = S[rowIndex]['Target Region'];
        if(columnIndex == 38) content = S[rowIndex]['Topicality'];
        if(columnIndex == 39) content = S[rowIndex]['Version'];
        if(columnIndex == 40) content = S[rowIndex]['Vocal Style'];
        if(columnIndex == 41) content = S[rowIndex]['composer'];
        if(columnIndex == 42) content = S[rowIndex]['region-code'];
      }

    } catch (e) {}
    return (<div className={className} key={key} style={style}>{content}</div>);
  }

  columnSize({index}) {
    switch (index) {
      case 0:  return 200;  // Song id
      case 1:  return 200; // Artist
      case 2:  return 200; // Song Name
      case 3:  return 40;  // BPM
      case 4:  return 80;  // Year
      default: return 160; // 32
    }
  }

  rowSize({index}) {
    switch (index) {
      case 0:  return 36; // Header
      default: return 32;
    }
  }

  // fixedColumnCount = {5}
  // fixedRowCount    = {1}
  render() {
    return (
        <AutoSizer>
        {({height, width}) => (
          <MultiGrid
          fixedRowCount    = {1}
          cellRenderer     = {this.cellRenderer}
          height           = {height}
          width            = {width}
          columnCount      = {2}
          rowCount         = {this.props.Songs.length}
          columnWidth      = {this.columnSize}
          rowHeight        = {this.rowSize}
          ref              = {(ref) => this._grid = ref}
          enableFixedColumnScroll
          />
        )}
        </AutoSizer>);
  } // end of render
} // end of class

  export default withTracker((props) => {
    return {
      Songs: Songs.find({}).fetch(),
    };
  })(SongsTable);
