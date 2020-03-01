import BMeetEvent from './EventInterface.js'

export default class BarhoppingEvent extends BMeetEvent{
    constructor(props){
        super(props);
        this.questions.push({id: "transport", label:"How well was transportation handled?"});
        this.questions.push({id: "bars", label:"How much did you like the bars your group visited?"});
    }
}



