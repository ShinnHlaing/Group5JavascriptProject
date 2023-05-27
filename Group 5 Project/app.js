const canvas = document.getElementById('canvas1');
const restartBtn = document.getElementById('restart');
const startGame = document.getElementById('startGame');
const introPage = document.getElementById('introPage');
const introSound = document.getElementById('introSound');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = "30px serif"
let particles = [];
let winningScore = 50;
let gameFinish = false;
let gameWin = false;
let gameLose = false;
let timer = 0;
const myCircle = {
    x: 500,
    y: 500,
    radius: 50,
    currentValue: 5
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer++;
    //gameFinish
    if (myCircle.currentValue < 0) {
        gameFinish = true;
        gameLose = true;
    }else if (myCircle.currentValue >= winningScore) {
        gameFinish = true;
        gameWin = true;
    }

    
    if (particles.length < 50 && timer % 10 === 0) {
        particles.push(
            {
                radius: 35,
                x: Math.random() * 100 + 50,
                y: Math.random() * 100 + 50,
                currentValue: Math.floor(Math.random() * 10 - 5),
                dy: Math.random() * 4,
                dx: Math.random() * 4,
                markForDeletion: false,
                red: Math.floor(Math.random() * 225),
                green: Math.floor(Math.random() * 225),
                blue: 0,
                draw: function () {
                    ctx.save();
                    ctx.fillStyle = `rgba(${this.red},${this.green},${this.blue})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'white';
                    ctx.fillText(this.currentValue, this.x - 5, this.y + 5);
                    ctx.restore();
                },
                move: function () {
                    this.y += this.dy;
                    this.x += this.dx;
                    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                        this.dx = -this.dx;
                    }
                    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
                        this.dy = -this.dy;
                    }
                }
            }
        )
    }

    ctx.fillStyle = '#26C6DA';
    ctx.beginPath();
    ctx.arc(myCircle.x, myCircle.y, myCircle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fillText(myCircle.currentValue, myCircle.x - 5, myCircle.y + 5);

    particles.forEach(particle => {
        particle.draw();
        particle.move();

        //collision
        const distanceX = particle.x - myCircle.x;
        const distanceY = particle.y - myCircle.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < particle.radius + myCircle.radius) {
            myCircle.currentValue += particle.currentValue;
            particle.markForDeletion = true;
        }
    })

    particles = particles.filter(particle => !particle.markForDeletion);
    if(gameWin) { 
        //code
        drawText('Game Win');
        
    }
    if(gameLose) {
        // code
        drawText('Game Lose');
    }
    if(gameFinish){
        restartBtn.style.display = 'block';
        restartBtn.addEventListener('click',() => {
            window.location.reload();
        })
    }
    if(!gameFinish) requestAnimationFrame(animate);
}

startGame.addEventListener('click',function(){
    introPage.style.display = 'none';
    canvas.style.display = 'block';
    introSound.play();
    requestAnimationFrame(animate);
})

window.addEventListener('mousemove', (e) => {
    myCircle.x = e.clientX;
    myCircle.y = e.clientY;
});


function drawText(text){
    ctx.save();
    ctx.font = '60px Impact';
    ctx.fillText(text, canvas.width * .4, canvas.height * .4);
    ctx.restore();
}



