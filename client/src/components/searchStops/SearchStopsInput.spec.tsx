import React from 'react';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import SearchStopsInput from './SearchStopsInput';
// Import the data to test With
import { stops } from '../../testUtils/testData';
import { act } from '@testing-library/react';

const makeProps = (props: any) => ({
  stops: [],
  handleSelectAutoSearch() {},
  ...props,
});

const setUp = (props: any) => {
  const component = shallow(<SearchStopsInput {...props} />);
  return component;
};

describe('Searchinput component', () => {
  let wrappedComponent: any;

  const handleSelectAutoSearch = jest.fn();

  beforeEach(() => {
    wrappedComponent = setUp(
      makeProps({
        stops,
        handleSelectAutoSearch,
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should test the jest framework', () => {
    expect(true).toBe(true);
  });

  it('Should match snapShot with the Seachinput component', () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it('Should test the AutoComplete component', () => {
    const searchField = wrappedComponent.find('#stops_autoComplete');

    act(() => {
      searchField.props().onSearch('Basel');
      searchField.props().onSelect('Basel', { stop: { name: 'Basel' } });
    });

    expect(searchField.props().value).toBe('');
    expect(handleSelectAutoSearch).toBeCalled();
  });
});
