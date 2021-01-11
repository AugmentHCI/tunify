import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SelectedContext, ContextColors, DetailsData } from '/imports/api/data.js';
import {Bar} from 'react-chartjs-2';

const data = {
  labels: [
        "NA",
        "Pop",
        "Rock'n'Roll",
        "Easy Listening",
        "Chanson",
        "Kleinkunst",
        "Music Hall",
        "Soul",
        "Funk",
        "Dance",
        "Electronic",
        "Urban",
        "Rock",
        "Metal",
        "Folk",
        "Traditional Music",
        "Latin",
        "World",
        "Gospel",
        "Reggae",
        "Country",
        "Lounge",
        "Jazz",
        "Blues",
        "Classical"
    ],
  datasets: [
    {
      label: 'Rhythm & Blues',
      backgroundColor: 'rgba(174, 82, 212, 0.8)',
      data:[0,0,0,0,0,0,0,_.random(1000),0,_.random(1000),0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    },
    {
      label: 'Dynamic',
      backgroundColor: 'rgba(255, 111, 0, 0.8)',
      data:[0,0,0,0,0,0,0,_.random(1000),0,0,0,_.random(1000),0,0,0,0,0,0,0,0,0,0,0,0]
    },
  ]
};

class SelectionChart extends Component {

  constructor(props) {
    super(props);
    // this.state = { color: ContextColors[_.indexOf(props.GetSelectedContext, props.ctx._id)]};
  }

  render() {
    return (
      <div className='DrawerVisuals'>
      <Bar height={320} data={data} />
      </div>
    );
  } // end of render
} // end of class

export default withTracker((props) => {
  return {
    GetAllDetailsData: DetailsData.all()
  };
})(SelectionChart);
