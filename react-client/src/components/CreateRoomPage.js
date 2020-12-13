import React, { Component } from 'react';

import { Grid,Button,TextField,FormHelperText,Radio,RadioGroup,FormControl,FormControlLabel, Typography } from '@material-ui/core';
import { typography } from '@material-ui/system';
import { Link } from 'react-router-dom';

class CreateRoomPage extends Component {
    defaultVotes = 2;
    constructor(props) {
        super(props);
        this.state = { 
            guestCanPause:true,
            votesToSkip:this.defaultVotes,
         };
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
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

    render() { 
        return (    
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Typography component="h4" varient="h4">
                        Create A Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                   <FormControl component='fieldset'>
                       <FormHelperText>
                           <div align='center'>
                                Guest Control of Playback State
                           </div>
                       </FormHelperText>
                       <RadioGroup onChange={this.handleGuestCanPauseChange} row defaultValue='true'>
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
                        defaultValue={this.defaultVotes}
                        inputProps={{min:1,style:{textAlign:"center"},}} />
                        <FormHelperText>
                            <div align='center'>
                                Votes Required to Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button onClick={this.handleRoomButtonPressed} color='primary' variant='contained'>Create A Room</Button>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button color='secondary' variant='contained' to='/' component={Link}>Back</Button>
                </Grid>
            </Grid>
         );
    }
}
 
export default CreateRoomPage;