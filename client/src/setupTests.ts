import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

//@ts-ignore
var createElementNSOrig = global.document.createElementNS
//@ts-ignore
global.document.createElementNS = function(namespaceURI, qualifiedName) {
  if (namespaceURI==='http://www.w3.org/2000/svg' && qualifiedName==='svg'){
  //@ts-ignore  
  var element = createElementNSOrig.apply(this,arguments)
  //@ts-ignore
    element.createSVGRect = function(){}; 
    return element;
  }
  //@ts-ignore
  return createElementNSOrig.apply(this,arguments)
}

configure( {adapter : new Adapter()})


