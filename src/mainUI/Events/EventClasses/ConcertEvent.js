import BMeetEvent from './EventInterface.js'

export default class ConcertEvent extends BMeetEvent{
    constructor(props){
        super(props);
        this.questions.push({id: "music", label:"How was the performance?"});
        this.questions.push({id: "value", label:"Were tickets free? Was it worth your time?"});
        this.questions.push({id: "vibe", label:"How would you describe the vibe?"});
    }
}



