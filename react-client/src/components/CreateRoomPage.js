import React, { Component } from 'react';

import { Grid,Button,TextField,FormHelperText,Radio,RadioGroup,FormControl,FormControlLabel, Typography,Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';

class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip:2,
        guestCanPause:true,
        update:false,
        roomCode:null,
        updateCallback:()=>{}
    }
    constructor(props) {
        super(props);
        this.state = { 
            guestCanPause:this.props.guestCanPause,
            votesToSkip:this.props.votesToSkip,
            errorMsg:"",
            successMsg:"",
         };
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }

    handleVotesChange(e){
        this.setState({
            votesToSkip:parseInt(e.target.value),
        })   
    }

    handleGuestCanPauseChange(e){
        this.setState({
            guestCanPause:e.target.value === 'true' ? true:false,
        })
    }

    handleRoomButtonPressed(){
        const requestOptions = {
            method:"POST",
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        };  
        fetch('/api/create-room/',requestOptions)
        .then(response=>response.json())
        .then(data=>{
            this.props.history.push('/room/'+ data.code);
        });
    }

    handleUpdateButtonPressed(){
        const requestOptions = {
            method:"PATCH",
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode
            })
        };  
        fetch('/api/update-room/',requestOptions)
        .then(response=>{
            if(response.ok){
                this.setState({
                    successMsg:"Room Updated Successfully!"
                })
            }
            else{
                this.setState({
                    errorMsg:"Error Updating Room!"
                })
            }
        this.props.updateCallback();  
        });
    }

    renderCreateButtons(){
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Button onClick={this.handleRoomButtonPressed} color='primary' variant='contained'>Create A Room</Button>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button color='secondary' variant='contained' to='/' component={Link}>Back</Button>
                </Grid>
            </Grid>
        );
    }

    renderUpdateButtons(){
        return (
            <Grid item xs={12} align='center'>
                <Button onClick={this.handleUpdateButtonPressed} color='primary' variant='contained'>Update Room</Button>
            </Grid>
        );
    }

    render() { 
        const title = this.props.update ? "Update Room":"Create a Room";
        
        return (    
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Collapse in={this.state.errorMsg!="" || this.state.successMsg!=""}>
                        {this.state.successMsg!=""?(<Alert severity='success' onClose={()=>{this.setState({successMsg:""})}}>{this.state.successMsg}</Alert>):(<Alert severity="error" onClose={()=>{this.setState({errorMsg:""})}}>{this.state.successMsg}</Alert>)}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Typography component="h4" variant="h4">
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                   <FormControl component='fieldset'>
                       <FormHelperText>
                           <div align='center'>
                                Guest Control of Playback State
                           </div>
                       </FormHelperText>
                       <RadioGroup onChange={this.handleGuestCanPauseChange} row defaultValue={this.props.guestCanPause.toString()}>
                           <FormControlLabel 
                           value='true' 
                           label="Play/Pause" 
                           labelPlacement="bottom" 
                           control={<Radio color='primary' />} />
                           <FormControlLabel 
                           value='false' 
                           label="No Control" 
                           labelPlacement="bottom" 
                           control={<Radio color='secondary' />} />
                       </RadioGroup>
                   </FormControl>
                </Grid>
                <Grid item xs={12} align='center'>
                    <FormControl>
                        <TextField 
                        onChange={this.handleVotesChange}
                        required='true' 
                        type="number" 
                        defaultValue={this.state.votesToSkip}
                        inputProps={{min:1,style:{textAlign:"center"},}} />
                        <FormHelperText>
                            <div align='center'>
                                Votes Required to Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update?this.renderUpdateButtons():this.renderCreateButtons()}
            </Grid>
         );
    }
}
 
export default CreateRoomPage;