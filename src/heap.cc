#include "heap.h"

/*
  init
  Allocate and initialize the heap object
  entrypoint for NAN
*/
void init(v8::Handle<v8::Object> target){
    Heap::createJSObject(target);
}
NODE_MODULE(heap, init);



/*
  diffHeaps
  Compare two different heap snapshots to find differences
  In this case I'm looking for the following
    - the number of strings allocated
    - how much memory was used in total during the request
    - how many user-defined classes were defined
*/
static v8::Local<v8::Value> diffHeaps(const v8::HeapSnapshot* start,
                                      const v8::HeapSnapshot* finish){

    // scope that can have a self-created object returned from it
    // return the heap diff
    Nan::EscapableHandleScope scope;
    v8::Local<v8::Object> heap = Nan::New<v8::Object>();
    
    // TODO: diff the heaps
    
    // escape the scope and return the allocated object
    return scope.Escape(heap);
}




/*
  Initialize all the default fields
*/
Heap::Heap():
    ObjectWrap(), start(nullptr), finish(nullptr){}
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
        Nan::New<v8::FunctionTemplate>(Start);

    stopTemplate->InstanceTemplate()->SetInternalFieldCount(1);
}
/*
  Start
  Construct a JS heap object and give it a start snapshot
*/
NAN_METHOD(Heap::Start){

    // create a local JS scope.
    Nan::HandleScope scope;

    // take a preliminary heap snapshot
    Heap *heap = new Heap();
    heap->Wrap(info.This());

    // take a preliminary heap snapshot and return a pointer to the c++ object
    heap->start = v8::Isolate::GetCurrent()->
        GetHeapProfiler()->TakeHeapSnapshot(nullptr);
    info.GetReturnValue().Set(info.This());
}


/*
  Stop
  heap.stop(); return the heap object created in diff().
*/
NAN_METHOD(Heap::Stop){
    // local JS scope
    Nan::HandleScope scope;
    Heap *heap = Unwrap<Heap>(info.This()); // unwrap the C++ pointer from Create().

    // create a second heap snapshot for the finish so that it can be diffed later
    heap->finish = v8::Isolate::GetCurrent()->
        GetHeapProfiler()->TakeHeapSnapshot(nullptr);

    // create a diffed heap and return it.
    v8::Local<v8::Value> diffedHeap = diffHeaps(heap->start, heap->finish);
    info.GetReturnValue().Set(diffedHeap);
}

