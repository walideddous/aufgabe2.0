import "@testing-library/jest-dom";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// To handle th SVG that render Leaflet in Test
//@ts-ignore
var createElementNSOrig = global.document.createElementNS;
//@ts-ignore
global.document.createElementNS = function (namespaceURI, qualifiedName) {
  if (
    namespaceURI === "http://www.w3.org/2000/svg" &&
    qualifiedName === "svg"
  ) {
    //@ts-ignore
    var element = createElementNSOrig.apply(this, arguments);
    //@ts-ignore
    element.createSVGRect = function () {};
    return element;
  }
  //@ts-ignore
  return createElementNSOrig.apply(this, arguments);
};

// To handle the mount enzyme method
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

configure({ adapter: new Adapter() });
