import BMeetEvent from './EventInterface.js'

export default class HousePartyEvent extends BMeetEvent{
    constructor(props){
        super(props);
        this.questions.push({id: "music", label:"How was the music at this party?"});
        this.questions.push({id: "food-drink", label:"How was the food and drink?"});
        this.questions.push({id: "vibe", label:"How would you describe the vibe?"});
    }
}



