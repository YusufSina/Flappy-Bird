import React, { Component } from 'react';

let Kus = {
    X: 50,
    Y: 75
};
let Gravity = {
    Force: 0.05,
    SpeedY: 0,
    SpeedX: 1
}
let Borular = [
    { X: 400, Y: 0, Height: 110, Width: 20, Border: 55 },
    { X: 500, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },
    { X: 600, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },
    { X: 700, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },
    { X: 800, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },

];
let interval;
export default class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            paused:false,
            crashed:false,
        }

        interval = setInterval(this.updateGame, 20);
    }
    draw = () => {
        const ctx = this.refs.canvas.getContext("2d");
        
        ctx.fillRect(Kus.X, Kus.Y, 10, 10);

        Borular.map((boru) => {
            ctx.fillRect(boru.X, boru.Y, boru.Width, boru.Border);
            ctx.fillRect(boru.X, (150 - boru.Y), boru.Width, -(110 - boru.Border));

        })
    }
    clear = () => {
        const ctx = this.refs.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    }
    ResetGame = () => {
        Kus = {
            X: 50,
            Y: 75
        };
        Borular = [
            { X: 400, Y: 0, Height: 110, Width: 20, Border: 55 },
            { X: 500, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },
            { X: 600, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },
            { X: 700, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },
            { X: 800, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 },
        
        ];
        Gravity = {
            Force: 0.05,
            SpeedY: 0,
            SpeedX: 1
        }
    }
    updatePositions = () => {
        if (Kus.Y >= (this.refs.canvas.height - 10) || Kus.Y <= 0) {
            this.GameOver();
            this.setState({
                crashed:true,
            })
        }
        else {
            Gravity.SpeedY += Gravity.Force;
            Kus.Y += Gravity.SpeedY;
        }

        if (Borular.length < 5) {
            Borular.push({ X: 480, Y: 0, Height: 110, Width: 20, Border: (Math.random()) * 111 })
        }

        this.anyAccident();
        this.ScoreCounter();
        if (Borular[0].X <= -20) {
            Borular.shift();
        }

        Borular.map((boru) => {
            boru.X -= Gravity.SpeedX
        })
    }
    anyAccident = () => {
        if ((Kus.X + 10 >= Borular[0].X && Kus.X <= Borular[0].X + 20) && ((Kus.Y <= Borular[0].Border) || (Kus.Y + 10 >= Borular[0].Border + 40))) {
            this.GameOver();
            this.setState({
                crashed:true,
            })
        }
    }
    ScoreCounter = () =>{
        if(Kus.X == Borular[0].X+20){
            this.setState({
                score: this.state.score+1,
            })
        }
    }
    updateGame = () => {
        this.clear();
        this.updatePositions();
        this.draw();
    }
    GameOver = () => {
        this.clear();
        clearInterval(interval);
    }
    GamePause = () => {
        clearInterval(interval);
    }
    GamePlay = () =>{
        interval = setInterval(this.updateGame, 20);
    }
    componentDidMount() {
        document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.onKeyUp.bind(this));
    }
    onKeyUp(e) {
        if (e.keyCode === 32 || e.keyCode === 38 || e.keyCode === 87) {
            Gravity.SpeedY = -1.5;
            if(this.state.crashed == true){
                this.TryAgainButtonClickHandler();
            }
        }
        else if(e.keyCode === 27 && (this.state.paused != true && this.state.crashed != true)){
            this.PauseButtonClickHandler();
        }
        else if(e.keyCode === 27 && (this.state.paused != false && this.state.crashed != true)){
            this.PlayButtonClickHandler();
        }
    }
    PlayButtonClickHandler = () =>{
        this.GamePlay();
        this.setState({
            paused:false
        })
    }
    PauseButtonClickHandler = () => {
        this.GamePause();
        this.setState({
            paused:true,
        })
    }
    TryAgainButtonClickHandler = () => {
        this.ResetGame();
        this.GamePlay();
        this.setState({
            crashed:false,
            score:0
        })
    }
    render() {
        let text;
        if(this.state.paused == false && this.state.crashed == false){
            text = "Game is on fire";
        } else if(this.state.paused == true){
            text = <text>Game is stopped <br></br> Press ESC to continue</text>
        }
        else{
            text = <text>You crashed <br></br> Press W, Space or Arrow up key to play again</text>
        }
        return (
            <div style={{"position":"relative"}}>
            <canvas ref="canvas" style={{ "border": "2px solid black", "marginTop": "20px", "width": "700px" }}>
                <div
                    className="player"
                    style={{ position: "absolute" }}
                    onKeyDown={this.onKeyPressed}
                    tabIndex="0"
                ></div>
            </canvas>
            <br></br>
            Score : {this.state.score}
            <br></br>
            <br></br>
            {text}
            <br></br>
            <button style={{"marginTop":"10px"}} onClick={
                this.PlayButtonClickHandler.bind(this)
                }disabled={!(this.state.paused) || this.state.crashed }>Play</button>
             <button style={{"marginTop":"10px"}} onClick={
                this.PauseButtonClickHandler.bind(this)
            }disabled={(this.state.paused || this.state.crashed)}>Pause</button>
            <button style={{"marginTop":"10px"}} onClick={
                this.TryAgainButtonClickHandler.bind(this)
            }  hidden={!this.state.crashed}>Try Again</button>
            </div>
        )
    }
}


