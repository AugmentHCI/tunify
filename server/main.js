import { Meteor } from 'meteor/meteor';
import { Songs } from '/imports/api/data';

// Server: Publish the `Rooms` collection, minus secret info...
Meteor.publish('songs', function () {
  return Songs.find({},{limit: 200});
});

Meteor.methods({
  'load.data': function(data) {
    let json = null;
    const subcontexts = [];
    xml2js.parseString(data, {attrkey:'att'}, function (err, result) {
      json = result;
      //console.log(result.musicCollection);
      //console.log(result.musicCollection.metadata[0]);
      //console.log(result.musicCollection.data[0]);
      /* Fetch the titles */
      titles       = _.map(result.musicCollection.metadata[0].titles[0].title, function(n) { return n.att; });
      descriptions = result.musicCollection.metadata[0].descriptions[0].description[0].att;
      categories   = result.musicCollection.metadata[0].categories[0].category[0];
      system       = result.musicCollection.metadata[0].system[0].att;

      selection = _.map(result.musicCollection.data[0].context[0]['tweakable-rules'][0]['selection-rule'], function(n) { return n; });
      interval  = _.map(result.musicCollection.data[0].context[0]['tweakable-rules'][0]['interval-rule'] , function(n) { return n; });

      // this.props.LocalContext.tweakable.selection
      // this.props.LocalContext.tweakable.interval
      // this.props.LocalContext.subcontext.selection
      // this.props.LocalContext.subcontext.interval

      const intervalTweakArr = [];
      if(interval != undefined) {
        _.forEach(interval, function(n) {
          if(n.att.field !== "Region Popularity" && n.att.field !== "Target Region" ) // WARNING REMOVE....
          intervalTweakArr.push({field: n.att.field, from: n['persistent-interval'][0].att.from, to: n['persistent-interval'][0].att.to, type: 'tweakable', mode: 'interval', ctxName: 'Tweakable Rules'  });
        });
      }

      const selectionTweakArr = [];
      if(selection != undefined) {
        _.forEach(selection, function(n) {
          const persistentNames = [];
          _.forEach(n['persistent-value'], function(p) {
            persistentNames.push(p.att.name);
          });
          if(n.att.field !== "Region Popularity" && n.att.field !== "Target Region" ) // WARNING REMOVE....
          selectionTweakArr.push({field: n.att.field, values: persistentNames, type: 'tweakable', mode: 'selection', ctxName: 'Tweakable Rules' })
        });
      }

      tweakable = {selection: selectionTweakArr, interval: intervalTweakArr};
      // Fetch sub-context data.
      _.forEach(result.musicCollection.data[0].context[0]['subcontexts'][0].subcontext, function(subcontext){
        name   = subcontext.att.name;
        weight = subcontext.att.weight;
        const intervalTmp = subcontext['interval-rule'];
        const intervalArr = [];
        if(intervalTmp != undefined) {
          _.forEach(intervalTmp, function(n) {
            if(n.att.field !== "Region Popularity" && n.att.field !== "Target Region" ) // WARNING REMOVE....
            intervalArr.push({field: n.att.field, from: n['persistent-interval'][0].att.from, to: n['persistent-interval'][0].att.to, type: 'subcontext', mode: 'interval', ctxName: name });
          });
        }
        const selectionTmp = subcontext['selection-rule'];
        const selectionArr = [];
        if(selectionTmp != undefined) {
          _.forEach(selectionTmp, function(n) {
            const persistentNames = [];
            _.forEach(n['persistent-value'], function(p) {
              persistentNames.push(p.att.name);
            });
            if(n.att.field !== "Region Popularity" && n.att.field !== "Target Region" ) // WARNING REMOVE....
            selectionArr.push({field: n.att.field, values: persistentNames, type: 'subcontext', mode: 'selection', ctxName: name });
          });
        }
        subcontexts.push({ name: name, weight:weight, selection: selectionArr, interval: intervalArr });
      });

    });
    return {
            titles: titles,
            descriptions: descriptions,
            categories:categories,
            system: system,
            tweakable: tweakable,
            subcontexts: subcontexts,
          };
  },
  'load.parameters': function() {
    return JSON.parse(Assets.getText("parameters.json"));
  },
  'countServerQuery': async function(query) {
    return Songs.find(query).count();
  },
});

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  // if (LinksCollection.find().count() === 0) {
  //   insertLink({
  //     title: 'Do the Tutorial',
  //     url: 'https://www.meteor.com/tutorials/react/creating-an-app'
  //   });
  //
  //   insertLink({
  //     title: 'Follow the Guide',
  //     url: 'http://guide.meteor.com'
  //   });
  //
  //   insertLink({
  //     title: 'Read the Docs',
  //     url: 'https://docs.meteor.com'
  //   });
  //
  //   insertLink({
  //     title: 'Discussions',
  //     url: 'https://forums.meteor.com'
  //   });
  // }
});
