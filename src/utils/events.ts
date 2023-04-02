import EventEmitter3 from "eventemitter3";

let instance: EventEmitter | null = null;

export class EventEmitter extends EventEmitter3 {

    constructor(){
        super()
    }

    static getInstance() {
        if (instance == null) {
            instance = new EventEmitter()
        }
        return instance
    }


}