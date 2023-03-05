var canvaswidth = 30;
var canvasheight = 20;
var blockSize = 30;
var ctx;
var delay = 100;
var snakee;
var newDirection;
var appleX;
var appleY;
var score = 0;

window.onload = function()
{
    init();

    function init()
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvaswidth*blockSize;
        canvas.height = canvasheight*blockSize;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4]], "right");
        refreshCanvas();
        newApple();
    }
    
    function refreshCanvas()
    {
        ctx.clearRect(0, 0, canvaswidth*blockSize, canvasheight*blockSize);
        snakee.draw();
        verify();
        snakee.advance();
        setTimeout(refreshCanvas, delay);
    }

    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#aa0000";
            drawBlock(ctx, this.body[0]);
            for(var i = 1; i < this.body.length; i++)
            {
                ctx.fillStyle = "#ff0000";
                drawBlock(ctx, this.body[i]);
            }
            ctx.beginPath();
            ctx.fillStyle = "#1DD83D";
            ctx.arc(appleX*blockSize+blockSize/2, appleY*blockSize+blockSize/2, blockSize/2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();

            if (this.body[0][0] >= canvaswidth || 
            this.body[0][1] >= canvasheight ||
            this.body[0][0] < 0 || 
            this.body[0][1] < 0 ) {
                perdu();
                } else {
                appleAte();
                }
        };

        this.advance = function()
        {
            switch(this.direction)
            {
                case "left":
                    this.body.unshift([this.body[0][0]-1, this.body[0][1]]);
                    break;
                case "right":
                    this.body.unshift([this.body[0][0]+1, this.body[0][1]]);
                    break;
                case "down":
                    this.body.unshift([this.body[0][0], this.body[0][1]+1]);
                    break;
                case "up":
                    this.body.unshift([this.body[0][0], this.body[0][1]-1]);
                    break;
                default:
                    throw("invalid direction");
            }
            this.body.pop();
        };

        this.setDirection = function(newDirection)
        {
            var allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("invalid direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        };
    };

    function perdu()
    {
        if (confirm('Perdu ! Vous avez mang\u00e9 ' + score + ' pommes. Voulez-vous rejouer ?')){
            location.reload();
        }else{
            alert('Merci d\'avoir jou\u00e9, \u00e0 bient\u00f4t');
            return;
        }
    };

    function newApple()
    {
        appleX = Math.floor(Math.random()*canvaswidth);
        appleY = Math.floor(Math.random()*canvasheight);
    };

    function appleAte()
    {
        if (snakee.body[0][0] == appleX && snakee.body[0][1] == appleY)
        {
            snakee.body.unshift([appleX, appleY]);
            score++;
            newApple();
        }else{
            return;
        }
    };

    function verify()
    {
        console.log(snakee.body.length);
        for (let i=1; i < snakee.body.length; i++ ) {

            console.log(snakee.body[i]);
            console.log(snakee.body[0]);

            if (snakee.body[i].toString() === snakee.body[0].toString()){
                perdu();
            }else{
                console.log(i + ' tour');
            }
        }
    };
}

document.onkeydown = function handleKeyDown(e)
{
    var key = e.keyCode;
    switch(key)
    {
        case 37:
            newDirection = "left";
            break;
        case 38:
            newDirection = "up";
            break;
        case 39:
            newDirection = "right";
            break;
        case 40:
            newDirection = "down";
            break;
        default:
            return;
    }
    snakee.setDirection(newDirection);
}