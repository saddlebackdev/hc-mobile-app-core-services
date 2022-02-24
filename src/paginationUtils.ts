// @ts-ignore
import _ from 'lodash';

let _cursor: number = 0;
let _data: Array<any> = [];
let _isLastChunk: boolean = true;
let _currentChunk: number = 0;
let _chunkSize: number = 250;
let _totalCount: number = 0;
let _maxChunks: number = 1;
let _pageSize: number = 20;

export const reset = () => {
  _cursor = 0;
  _data = [];
  _isLastChunk = true;
  _currentChunk = 0;
  _totalCount = 0;
};

export const initiliaze = (
  pageSize: number = 20,
  chunkSize: number = 250,
  maxChunks: number = -1
) => {
  _pageSize = pageSize;
  _chunkSize = chunkSize;
  _maxChunks = maxChunks;
  reset();
};

export const loadChunk = (
  results: Array<any>,
  totalCount: number,
  resetData: boolean
) => {
  if (resetData) {
    _data = results;
    _cursor = 0;
    _currentChunk = 0;
  } else if (_data.length < _totalCount) {
    _data = _.concat(_data, results);
    _currentChunk++;
  }
  _isLastChunk = maxChunk() || results.length < _chunkSize;
  _totalCount = totalCount;
};

export const canLoadMore = () => {
  return !_isLastChunk || _cursor < _data.length;
};

export const needsToLoadChunk = () => {
  return !_isLastChunk && _cursor >= _data.length;
};

const maxChunk = () => {
  return _maxChunks > 0 && _currentChunk >= _maxChunks - 1;
};

export const maxRows = () => {
  return _maxChunks > 0 ? _maxChunks * _chunkSize : -1;
};

export const getAll = (next: boolean = true) => {
  if (next) {
    _cursor += _pageSize;
  }

  return _.slice(_data, 0, _cursor);
};

export const getCursor = () => {
  return _cursor;
};

export const getCurrentCount = () => {
  return _data.length;
};

export const getTotalCount = () => {
  return _totalCount;
};

export const getChunkSize = () => {
  return _chunkSize;
};

export const getCurrentChunk = () => {
  return _currentChunk;
};

export default {
  loadChunk,
  canLoadMore,
  needsToLoadChunk,
  maxChunk,
  maxRows,
  getAll,
  getCursor,
  getCurrentCount,
  getTotalCount,
  getChunkSize,
  getCurrentChunk,
};
