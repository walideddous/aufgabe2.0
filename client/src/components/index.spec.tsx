import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

// Import the component
import MainRoot from './index';

const setUp = () => {
  const component = shallow(<MainRoot />);
  return component;
};

describe('Main component => components/index.tsx', () => {
  let wrappedComponent: any;

  beforeEach(() => {
    wrappedComponent = setUp();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should test the jest framework', () => {
    expect(true).toBe(true);
  });

  it('Should match snapShot with the main component => component/index', () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });
});
