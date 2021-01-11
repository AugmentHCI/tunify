import { Mongo } from 'meteor/mongo';

export const Songs              = new Mongo.Collection('songs');
export const ContextParameters  = new Mongo.Collection('ContextParameters', {connection: null});
export const LocalContext       = new Mongo.Collection('LocalContext', {connection: null});
export const SelectedContext    = new ReactiveVar([]);
export const SelectedTableItems = new ReactiveVar([]);
export const OpenDrawer         = new ReactiveVar(false);
export const DetailsData        = new ReactiveDict();
export const VisualTableHeaders = new ReactiveVar([]);
export const ContextDictTotals  = new ReactiveDict();
export const ContextColors      = ['174,82,212', '255,111,0', '56,142,60', '251,192,45', '194,24,91','103, 58, 183'];
export const TableOrientation   = new ReactiveVar('horizontal');
export const TableFullContexts  = new ReactiveVar([]);
export const ExpandedContexts   = new ReactiveVar([]);
