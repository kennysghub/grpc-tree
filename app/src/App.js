import './App.css';
import { useCallback, useRef } from 'react';
import protobuf from 'protobufjs'

function App() {

  const treeData = useRef({})


  const printDefinitions = (object, prefix = '') => {
    let currentObject = {}
    for(let name in object.nested){
      let nested = object.nested[name];

      //log definition itself
      //console.log('this is the whole object: ', prefix + name, nested)

      //if its a message, log its fields
      if(nested instanceof protobuf.Type) {
        currentObject[name] = { type: 'message', fields: {}, name: name };
        for(let fieldName in nested.fields){
          let field = nested.fields[fieldName];
          currentObject[name].fields[fieldName] = {
            id: field.id,
            name: field.name,
            repeated: field.repeated,
            options: field.options,
            type: field.type
          };
          // console.log('this is a message', prefix + name + '.' + fieldName, field)
          // console.log('this is name of message: ', name)
          // console.log('this is the id : ', field.id)
          // console.log('this is the name:', field.name)
          // console.log('is repeated? :', field.repeated)
          // console.log('these are options : ', field.options)
          // console.log('this is the (data) type : ' , field.type)
        }
      }

      //if its a service, log its methods
      else if(nested instanceof protobuf.Service){
        currentObject[name] = { type: 'service', methods: {}, name: name };
        for(let methodName in nested.methods){
          let method = nested.methods[methodName];
          currentObject[name].methods[methodName] = {
            name: method.name,
            requestType: method.requestType,
            responseType: method.responseType,
            type: method.type,
            requestStream: method.requestStream,
            responseStream: method.responseStream,
            options: method.options
          };
          // console.log('this is a service',prefix + name + '.' + methodName, method);
          // console.log('this is name of service: ', name)
          // console.log('this is name of method in the service: ', method.name)
          // console.log('this is request type of service: ', method.requestType)
          // console.log('this is response type of service: ', method.responseType)
          // console.log('type of method (most likely rpc: ', method.type)
          // console.log('this is requestStream (return true or false) : ' , method.requestStream)
          // console.log('this is responseStream (returns true of false) : ' , method.responseStream)
          // console.log('these are options for service:', method.options)
          // treeData.current.name = name;
          // treeData.current.children = []
          // treeData.current.children.push({name: method.name, children: [{name: method.requestType}, {name: method.responseType}]})

          // console.log('this is the tree data', treeData.current)

        }
      }

      else if(nested instanceof protobuf.Enum){
        currentObject[name] = { type: 'enum', values: nested.values, name: name };
        // for(let valueName in nested.values){
        //   let value = nested.values[valueName];
        //   console.log('this is an enum', prefix + name + '.' + valueName, value)
        // }
      }

      else {
        currentObject[name] = {}
      }

      if(nested.nested){
        currentObject[name].nested = printDefinitions(nested, prefix + name + '.')
      }
    }

    return currentObject
  }


  const onFileChange = useCallback((event) => {
    const file = event.target.files[0]; //get selected file

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result //contents of file

      const root = protobuf.parse(contents).root //parse contents of file

      treeData.current = printDefinitions(root);

      // printDefinitions(root); //prints all names of nested elements

      console.log('this is the current object: ', treeData.current)
    }

    reader.readAsText(file); //read file as text
  }, [treeData])



  return (
    <div>
      <input type='file' onChange={onFileChange}/>
    </div>
  );
}

export default App;


//