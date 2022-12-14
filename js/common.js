window.onload = function(){
    var toggleMenu = false;
    var trigerMenu = document.getElementById("menu");
    var gnbMenu = document.getElementById("gnb");

    trigerMenu.onclick = function(){
        if(window.innerWidth < 1024){
            if(toggleMenu){
                toggleMenu = false;
                gnbMenu.style.width = "0";
            } else {
                toggleMenu = true;
                gnbMenu.style.width = "100%";
            }
            gnbMenu.style.transition = "all .5s"
           
            this.classList.toggle("active");
            gnbMenu.classList.toggle("active");
        }
        
    };
    window.onresize = function(){
        gnbMenu.style.transition = "none";

        if(window.innerWidth > 1024){
            gnbMenu.style.width ="calc(100% - 175px)";
        } else {
            toggleMenu = false;
            gnbMenu.style.width = "0";
            trigerMenu.classList.remove("active");
        }
    }

        var splitText = new SplitText('title', {type: 'chars'});

        var tl = gsap.timeline();


    tl
	.from(splitText.chars, {duration: .5, opacity: 0, stagger: .125,  ease: 'power1. In'})
	.to(splitText.chars, {duration: .25, opacity: 0, stagger: .125,  ease: 'power3. inOut'}, '+=3');

    (function(){

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
      
        var canvas = document.querySelector("canvas");
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight;
      
      
        var ctx = canvas.getContext("2d");
        //stats.js
        var stats = new Stats();
        document.body.appendChild( stats.dom );
      
        var particles = [];
        var pIndex = 0;
        var x, y, frameId;
      
        //Particle作成
        function Particle(x,y,scaleX,scaleY,color,accel,lineWidth){
          this.x = x;
          this.y = y;
          this.scaleX = scaleX;
          this.scaleY = scaleY;
          this.vx = 1;
          this.accel = accel;
          particles[pIndex] = this;
          this.id = pIndex;
          pIndex++;
          this.life = 0;
          this.radius = getRandom(canvas.height/2, canvas.height);
          this.width = 0;
          this.color = color;
          this.rotate = Math.PI/180*getRandom(0,360);
          this.lineWidth = getRandom(.1,lineWidth);
          this.degree = 0;
          this.maxlife = 50;
        };
        Particle.prototype.draw = function(){
      
          this.vx *= this.accel;
          this.width = this.vx;
      
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.radius*this.scaleX, this.radius*this.scaleY, this.rotate,  0 * Math.PI/180 ,  (this.width) * Math.PI/180);
            ctx.lineWidth = this.lineWidth;
            ctx.lineWidth -= this.vx;
            ctx.stroke();
            ctx.globalAlpha = (1- this.life/this.maxlife)*0.5;
            ctx.closePath();
      
      
      
          this.life++;
          if(this.life >= this.maxlife){
            delete particles[this.id];
          }
        }
      
      
        //GUI
        var params,params_A,params_B;
        function setGUI(){
      
          params = {
            'colorful_mode': true,
            'amount': 2,
            'bg_color' : "#000",
            'afterimage': 0.1,
          };
      
          params_A = {
            'active':true,
            'scaleX':0.5,
            'scaleY':2,
            'color': "#47f4ff",
            'accel': 1.2,
            'lineWidth':2
          };
      
          params_B = {
            'active':true,
            'scaleX':2,
            'scaleY':0.5,
            'color': "#47f4ff",
            'accel': 1.2,
            'lineWidth':2
          };
      
          var gui = new dat.GUI();
          gui.add( params, 'colorful_mode');
          gui.add( params, 'amount', 1.0, 10 ).step( 1 );
          gui.addColor( params, 'bg_color');
          gui.add( params, 'afterimage', 0, 1 ).step( .01 );
      
          var fA = gui.addFolder('particle_A')
          fA.add( params_A, 'active');
          fA.addColor( params_A, 'color');
          fA.add( params_A, 'scaleX', 0.1, 2 ).step( 0.1 );
          fA.add( params_A, 'scaleY', 0.1, 2 ).step( 0.1 );
          fA.add( params_A, 'accel', 1.02, 1.5 ).step( 0.01 );
          fA.add( params_A, 'lineWidth', 0.1, 10 ).step( 0.1 );
      
          var fB = gui.addFolder('particle_B')
          fB.add( params_B, 'active');
          fB.addColor( params_B, 'color');
          fB.add( params_B, 'scaleX', 0.1, 2 ).step( 0.1 );
          fB.add( params_B, 'scaleY', 0.1, 2 ).step( 0.1 );
          fB.add( params_B, 'accel', 1.02, 1.5 ).step( 0.01 );
          fB.add( params_B, 'lineWidth', 0.1, 10 ).step( 0.1 );
      
        }
        setGUI();
      
        function loop(){
          ctx.fillStyle = params.bg_color;
          ctx.globalAlpha = params.afterimage;
          ctx.fillRect(0,0, canvas.width, canvas.height);
          canvas.style.background = params.bg_color;
      
          var cw = canvas.width;
          var ch = canvas.height;
          for (var i = 0; i <params.amount; i++) {
            if(frameId % 10== 0){
      
              var colorA,colorB;
              if (params.colorful_mode) {
                var hue = Math.floor(getRandom(0,12.99))*30;
                var hsl_color = "hsl(" + hue + ", 100%, 50%)";
                colorA = colorB = hsl_color;
              }else{
                colorA = params_A.color;
                colorB = params_B.color;
              }
      
              if (params_A.active) {
                  new Particle(cw/2,ch*1.5,params_A.scaleX,params_A.scaleY,colorA,params_A.accel,params_A.lineWidth);
              }
              if (params_B.active) {
                  new Particle(cw/2,ch-ch*1.5,params_B.scaleX,params_B.scaleY,colorB,params_B.accel,params_B.lineWidth);
              }
            }
          }
      
          for(var i in particles){
            particles[i].draw();
          }
          frameId = requestAnimationFrame(loop);
          if(frameId % 2 == 0) { return; }
          stats.update();
        }
        loop();
      
        window.addEventListener("resize", function(){
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          x = canvas.width / 2;
          y = canvas.height / 2;
        });
      
        function getRandom(min, max) {
          return Math.random() * (max - min) + min;
        }
      
      })();
      
}






