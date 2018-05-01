var bkcol='#b3d9ff',wallcol='#123445';//,buildingcol='#123445',chasecol='#87c3ff',shootcol='#52a2f2',guardcol='#0a1628';
var maze,size,xoffset,yoffset,posx,posy,currentx,currenty,prevx,prevy,dx,dy,found;
var b_play,b_pause,b_reset,pause,s_slider;

function setup(){
  var mycv=createCanvas(window.innerWidth,window.innerHeight-80);
  mycv.parent('sketch-holder');
  xoffset=window.innerWidth/2-185;
  yoffset=100;

  b_play=createButton('PLAY');
  b_play.position(xoffset,yoffset+15*25+120);
  b_play.mousePressed(f_play);

  b_pause=createButton('PAUSE');
  b_pause.position(b_play.x+b_play.width,b_play.y);
  b_pause.mousePressed(f_pause);

  b_reset=createButton('RESET');
  b_reset.position(b_pause.x+b_pause.width,b_play.y);
  b_reset.mousePressed(f_reset);

  s_slider=createSlider(10,60,10);
  s_slider.position(b_reset.x+b_reset.width+20,b_play.y+8);

  reset();
}

function draw(){
  background(bkcol);
  frameRate(s_slider.value());
  noStroke();
  
  fill(0);
  textSize(35);
  textStyle(BOLD);
  textAlign(CENTER,CENTER);
  text('TREMAUXS ALGORITHM',window.innerWidth/2,40);
  drawmaze();
  if(frameCount%10==0){
    if(!pause)
      moveas(currentx,currenty);
    drawball();
  }
  else{
    if(found)
      drawpath();
    drawball();
  }
}

function moveas(x,y){
  var dir=0,dir1=0;
  var direction0=[];
  var direction1=[];
  
  if(atjunction(x,y)){
    //console.log('--------AT JUNCTION------');

    if(maze[prevx][prevy]==0)
      maze[prevx][prevy]=1;
    else if(maze[prevx][prevy]==1)
      maze[prevx][prevy]=2;

    //console.log('currentx: '+currentx);
    //console.log('currenty: '+currenty);

    if(x==1&&y==1&&maze[2][1]==2&&maze[1][2]==2){
      dx=0;dy=0;
      maze[1][1]=0;
    }

      var match=false;

    if(maze[0][1]==1&&x==1&y==1){
      dir1++;
    }
    //down
    if((x+1<=13&&maze[x+1][y]!=3)&&(x+1<=13&&maze[x+1][y]!=2)||(x==13&&y==13)){
      //console.log('Case DOWN');
      direction0[2*dir]=1;
      direction0[2*dir+1]=0;
      dir++;
      if(maze[x+1][y]==1||maze[x+1][y]==2){
        match=true;
        direction1[2*dir1]=1;
        direction1[2*dir1+1]=0;
        dir1++;
      }
    }
    //up
    if(((x-1>0&&maze[x-1][y]!=3)&&(x-1>0&&maze[x-1][y]!=2))){
      //console.log('Case UP');
      direction0[2*dir]=-1;
      direction0[2*dir+1]=0;
      dir++;
      if(maze[x-1][y]==1||maze[x-1][y]==2){
        match=true;
        direction1[2*dir1]=-1;
        direction1[2*dir1+1]=0;
        dir1++;
      }
    }
    //right
    if((y+1<=13&&maze[x][y+1]!=3)&&(y+1<=13&&maze[x][y+1]!=2)){
      //console.log('Case RIGHT');
      direction0[2*dir]=0;
      direction0[2*dir+1]=1;
      dir++;
      if(maze[x][y+1]==1||maze[x][y+1]==2){
        match=true;
        direction1[2*dir1]=0;
        direction1[2*dir1+1]=1;
        dir1++;
      }
    }
    //left
    if((y-1>0&&maze[x][y-1]!=3)&&(y-1>0&&maze[x][y-1]!=2)){
      //console.log('Case LEFT');
      direction0[2*dir]=0;
      direction0[2*dir+1]=-1;
      dir++;
      if(maze[x][y-1]==1||maze[x][y-1]==2){
        match=true;
        direction1[2*dir1]=0;
        direction1[2*dir1+1]=-1;
        dir1++;
      }
    }

    var temp=dir,temp1=dir1;

    //limiting directions
    if(dir1>0&&dir1<dir){
      for(var i=0,j=0;i<2*dir,j<2*dir1;i+=2){
        if(direction0[i]==direction1[j]&&direction0[i+1]==direction1[j+1]){
          for(var k=i;k<2*dir;k+=2){
            if(direction0[k+2]!=undefined){
              direction0[k]=direction0[k+2];
              direction0[k+1]=direction0[k+3];         
            }
            else{
              direction0[k]=undefined;
              direction0[k+1]=undefined;
            }
            i-=2;
          }
          dir--;
          j+=2;
        }
      }
    }

    // console.log('direction0 : '+direction0);
    // console.log('direction1 : '+direction1);

    var case1=false,case2=false,case3=false;
    var match=false;

    if(temp==temp1&&maze[prevx][prevy]!=2){
      for(var i=0;i<temp*2;i++){
        if(direction1[1]!=undefined&&direction0[i]==direction1[i])
          match=true;
        else
          match=false;
      }
    }

    if(match)
      case2=true;
    
    // console.log('dir : '+dir);
    // console.log('dir1 : '+dir1);
    // console.log('temp: '+temp);
    // console.log('temp1: '+temp1);

    //case 1 - new junction , no mark
    if(temp>0&&temp1<=1){
      console.log('CASE : NEW JUNCTION');
      var go=int(Math.random()*dir+1);

      dx=direction0[(go-1)*2];
      dy=direction0[(go-1)*2+1];
      if(maze[x+dx][y+dy]==0)
        maze[x+dx][y+dy]=1;
      else if(maze[x+dx][y+dy]==1)
        maze[x+dx][y+dy]=2;
      //console.log(maze);
    }
    //mark
    else {  
      //turn back
      if(temp1>1&&!case2){
        console.log('CASE : FIND LEAST');
        var go=int(Math.random()*dir+1);
        dx=direction0[(go-1)*2];
        dy=direction0[(go-1)*2+1];
      }

      else if(case2){
        console.log('CASE : TURN BACK');
        dx=-dx;
        dy=-dy;
      }
      //random
      //find least path
      
      if(maze[x+dx][y+dy]==0)
        maze[x+dx][y+dy]=1;
      else if(maze[x+dx][y+dy]==1)
        maze[x+dx][y+dy]=2;
      //console.log(maze);
    }
  }

  prevx=currentx;
  prevy=currenty;
  currentx+=dx;
  currenty+=dy;
  if(currentx==14&&currenty==13){
    found=true;
    dx=0;
    dy=0;
    drawpath();
  }
}

function drawball(){
  boardtocanvas(currentx,currenty);
  fill(255);
  ellipse(posx+12.5,posy+12.5,17,17);
}

function drawmaze(){
  noStroke();
  fill(wallcol);
  for(var i=0;i<15;i++){
    for(var j=0;j<15;j++){
      if(maze[i][j]==3)
        rect(xoffset+25*j,yoffset+i*25,25,25);
      else if(maze[i][j]==1)
        rect(xoffset+25*j+10,yoffset+i*25+10,5,5);
      else if(maze[i][j]==2){
        stroke(2);
        line(xoffset+25*j,yoffset+i*25,xoffset+25*(j+1),yoffset+(i+1)*25);
        line(xoffset+25*(j+1),yoffset+i*25,xoffset+25*j,yoffset+(i+1)*25);
        noStroke();
      }
    }
  }
}

function drawpath(){
  fill('#1f0fff');
  stroke(2);
  line(xoffset+25+12.5,yoffset+12.5,xoffset+25+12.5,yoffset+25+12.5);
  line(xoffset+13*25+12.5,yoffset+14*25+12.5,xoffset+13*25+12.5,yoffset+13*25+12.5);

  for(var i=0;i<15;i++){
    for(var j=0;j<15;j++){
      stroke(2);
      if(atjunction(i,j)&&(maze[i+1][j]==1||maze[i][j+1]==1||maze[i-1][j]==1||maze[i][j-1]==1)){
        //down line
        if(maze[i+1][j]==1){
          for(var k=i+2;k<15;k++){
            if(maze[k][j]==1){
              line(xoffset+j*25+12.5,yoffset+i*25+12.5,xoffset+j*25+12.5,yoffset+k*25+12.5);
              break;
            }
          }
        }
        //up line
        if(maze[i-1][j]==1){
          for(var k=i-2;k>0;k--){
            if(maze[k][j]==1){
              line(xoffset+j*25+12.5,yoffset+i*25+12.5,xoffset+j*25+12.5,yoffset+k*25+12.5);
              break;
            }
          }
        }
        //right line
        if(maze[i][j+1]==1){
          for(var k=j+2;k<15;k++){
            if(maze[i][k]==1){
              line(xoffset+j*25+12.5,yoffset+i*25+12.5,xoffset+k*25+12.5,yoffset+i*25+12.5);
              break;
            }
          }
        }
        //left line
        if(maze[i][j-1]==1){
          for(var k=j-2;k>0;k--){
            if(maze[i][k]==1){
              line(xoffset+j*25+12.5,yoffset+i*25+12.5,xoffset+k*25+12.5,yoffset+i*25+12.5);
              break;
            }
          }
        }
        noStroke();
        rect(xoffset+25*j+10,yoffset+i*25+10,5,5);
      }
    }
  }
  noStroke();
}

function boardtocanvas(i,j){
  posx=xoffset+j*25;
  posy=yoffset+i*25;
}

function atjunction(x,y){
  if((x==1&&(y==1||y==4||y==10||y==13))||
     (x==4&&(y==4||y==7||y==10||y==10||y==13))||
     (x==7&&(y==1||y==4||y==7||y==10))||
     (x==10&&(y==1||y==4||y==7||y==10||y==13))||
     (x==13&&(y==1||y==7||y==10||y==13))
     ){
    return true;
  }
  else
    return false;
}

function f_play(){
  pause=false;
}

function f_pause(){
  pause=true;
}

function f_reset(){
  reset();
}

function reset(){
  size=15;
  prevx=0;
  prevy=1;
  currentx=0;
  currenty=1;
  dx=1;
  dy=0;
  found=false;

  pause=false;

  s_slider.value(0);

  maze=[
      [3,0,3,3,3,3,3,3,3,3,3,3,3,3,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,3,3,0,3,3,3,3,3,0,3,3,0,3],
      [3,0,3,3,0,3,3,3,3,3,0,3,3,0,3],
      [3,0,3,3,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,3,3,0,3,3,0,3,3,0,3,3,0,3],
      [3,0,3,3,0,3,3,0,3,3,0,3,3,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,3,3,0,3],
      [3,0,3,3,0,3,3,0,3,3,0,3,3,0,3],
      [3,0,3,3,0,3,3,0,3,3,0,3,3,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,3,3,3,3,3,0,3,3,0,3,3,0,3],
      [3,0,3,3,3,3,3,0,3,3,0,3,3,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,3,3,3,3,3,3,3,3,3,3,3,3,0,3]];
}