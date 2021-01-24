import React from 'react';
import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Map from './Map';

// import the datat to test with
import {
  stops,
  stopSequence,
  selectedStop,
  currentManagedRoute,
  distance,
} from '../../testUtils/testData';

const makeProps = (props: any) => ({
  stops: [],
  stopSequence: {},
  selectedStop: {},
  currentManagedRoute: {},
  distance: [],
  onReseTManagedRoute() {},
  handleSelectAutoSearch() {},
  onAddAfterselectedStop() {},
  onAddBeforselectedStop() {},
  onDeleteStop() {},
  selectMarkerOnMap() {},
  ...props,
});

jest.mock('leaflet', () => ({
  ...jest.requireActual('leaflet'),
  markerClusterGroup: jest.fn(() => {}),
}));

const setUp = (props: any) => {
  const div = global.document.createElement('div');
  global.document.body.appendChild(div);
  const component = mount(<Map {...props} />, { attachTo: div });
  return component;
};

const onReseTManagedRoute = jest.fn();
const onSelectAutoSearch = jest.fn();
const onAddBeforselectedStop = jest.fn();
const onAddAfterselectedStop = jest.fn();
const onDeleteStop = jest.fn();
const onClickOnMapMarker = jest.fn();

describe('Map component', () => {
  const div = global.document.createElement('div');
  global.document.body.appendChild(div);

  let mountwrapper: any;

  beforeEach(() => {
    mountwrapper = setUp(
      makeProps({
        stops,
        stopSequence,
        selectedStop,
        currentManagedRoute,
        distance,
        onReseTManagedRoute,
        onSelectAutoSearch,
        onAddBeforselectedStop,
        onAddAfterselectedStop,
        onDeleteStop,
        onClickOnMapMarker,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should match snapshot with the Map component', () => {
    expect(toJSON(mountwrapper)).toMatchSnapshot();
  });
});

it('Should clear the map when we click on the trash button', () => {
  const button = shallow(
    <Map
      {...makeProps({
        stops,
        stopSequence,
        selectedStop,
        currentManagedRoute,
        distance,
        onReseTManagedRoute,
        onSelectAutoSearch,
        onAddBeforselectedStop,
        onAddAfterselectedStop,
        onDeleteStop,
        onClickOnMapMarker,
      })}
    />
  ).find("div[className='trash_button']");

  button.simulate('click');

  expect(onReseTManagedRoute).toBeCalled();
});
