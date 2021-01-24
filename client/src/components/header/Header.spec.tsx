import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Header from './Header';

const makeProps = (props: any) => ({
  radioButton: '',
  saveButtonDisabled: false,
  currentManagedRoute: {},
  onClearAll() {},
  onSaveButton() {},
  onLadenButton() {},
  onErstellenButton() {},
  onAbbrechenButton() {},
  onDisplayStopSequenceQuery() {},
  onDeleteStopSequenceMutation() {},
  ...props,
});

const setUp = (props: any) => {
  const shallowWrapper = shallow(<Header {...props} />);
  return shallowWrapper;
};

describe('Test the Header Component', () => {
  let shallowWrapper: any;

  const clickedHeaderButton = '';
  const isHeaderSaveButtonDisabled = true;
  const currentManagedRoute = {};
  const onClearAll = jest.fn();
  const onCLickOnHeaderSaveButton = jest.fn();
  const onClickOnHeaderLoadButton = jest.fn();
  const onClickOnHeaderNewButton = jest.fn();
  const onClickOnHeaderCancelButton = jest.fn();
  const onDisplayStopSequenceQuery = jest.fn();
  const onDeleteStopSequenceMutation = jest.fn();

  beforeEach(() => {
    shallowWrapper = setUp(
      makeProps({
        clickedHeaderButton,
        isHeaderSaveButtonDisabled,
        currentManagedRoute,
        onClearAll,
        onCLickOnHeaderSaveButton,
        onClickOnHeaderLoadButton,
        onClickOnHeaderNewButton,
        onClickOnHeaderCancelButton,
        onDisplayStopSequenceQuery,
        onDeleteStopSequenceMutation,
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should test the jest framework', () => {
    expect(true).toBe(true);
  });
  it('Should match the Header component snapshot', () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });
  it('Should test  ');
});
