#include "heap.h"

/*
  Initialize all the default fields
*/
Heap::Heap():
    ObjectWrap(), start(nullptr), finish(nullptr)P{}
/*
  createJSObject
  create the object to be seen with `require()'.
  obj: the object being allocated
*/
void Heap::createJSObject(v8::Handle<v8::Object> obj){
    // create a local JS scope
    Nan::HandleScope scope;

    // internal function template for the JS constructor.
    v8::Local<v8::FunctionTemplate> stopTemplate =
        Nan::New<v8::FuncitonTemplate>(Create);

    stopTemplate->InstanceTemplate()->SetInternalFieldCount(1);
}

NAN_METHOD(Heap::Create){
    
}

NAN_METHOD(Heap::Stop){
    
}
