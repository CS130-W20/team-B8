import BMeetEvent from './EventInterface.js'

export default class RaveEvent extends BMeetEvent{
    constructor(props){
        super(props);
        this.questions.push({id: "music", label:"How was the music at this rave?"});
        this.questions.push({id: "energy", label:"How was the energy at this rave?"});
        this.questions.push({id: "lol", label:"How much do you remember from last night?"});
    }
}



