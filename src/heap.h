#ifndef _HEAP_
#define _HEAP_

#include <nan.h>
#include <v8-profiler.h> // used for HeapSnapshots.

/*
  Heap
  Provide an abstraction over v8 heap snapshots.
  Used for the `diff' functinoality.

  Is a NaN Object wrapper.
*/

class Heap : public Nan::ObjectWrap{
    /* 
       heap snapshots to diff later on
       start is created at object instantiation (request start)
       finish is created after the request issues the `finish' event.
    */
    const v8::HeapSnapshot *start;
    const v8::HeapSnapshot *finish;

 public:
    Heap();
    static void createJSObject(v8::Handle<v8::Object> obj);
    static NAN_METHOD(Start);
    static NAN_METHOD(Stop);
};

#endif
