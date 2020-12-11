import React,{Component} from "react";

import HomePage from './components/HomePage'
import CreateRoomPage from './components/CreateRoomPage'
import RoomJoinPage from './components/RoomJoinPage'

class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                <HomePage />
                <RoomJoinPage />
                <CreateRoomPage />
            </div>
        );
    }
}


export default App;
