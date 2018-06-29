var div;

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'style.css');
document.getElementsByTagName('head')[0].appendChild(link);

var angle;//angle
var Inclinedplane;//inclined plane element
var modelplane;//inclined plane background color
var base;//base element under inclined plane
var cylinder;//cylinder element
var v1x;//x coordinate of first vertex of inclined plane(triangle)
var v1y;//y coordinate of first vertex of inclined plane(triangle)
var v2x;//x coordinate of secondvertex of inclined plane(triangle)
var v2y;//y coordinate of second vertex of inclined plane(triangle)
var v3x;//x coordinate of third vertex of inclined plane(triangle)
var v3y;//y coordinate of third vertex of inclined plane(triangle)
var cenx;//x coordinate of center of cylinder (2D)
var ceny;//y coordinate of center of cylinder(2D)
var vx=0;//intial velocity of cylinder along x direction(x component)
var vy=0;//intial velocity of cylinder along y direction(y component)
var upx;
var upy;
var uppx;
var u=0.30;//coefficient of friction
var g=9.8;//gravity
var accx;//accelaration of cylinder along x direction
var accy;//accelaration of cylinder along y direction
var m=2;//cylinder mass=2kg
//angle=PIEgetInputSlider("angle");
var distance;
var loop=true;
var fstatic;//static friction force
var fslide;//sliding friction force
var froll;//rolling friction force
var board;//board image element
var freebody;
var notes;//notes image element
var bench;//bench image element
//some texts variables
var text1;
var text2;
var text3;
var text4;
var text5;
var text6;
var text7;
var text8;
var text9;
var dragx;
var dragy;
var vara,varb,varc,vard;
var back,dustbin;

function initialiseScene(){
// var change=document.getElementsByTagName("li");
// if(change){


// change.style.width=260px;
// change.style.font-size=18px;
// }
}

function loadExperimentElements(){
    var loader, tex, material, geometry;

    PIEsetExperimentTitle("Types of Friction");
    PIEsetDeveloperName("Bonthu Badrinath");
    
    initialiseHelp();
    initialiseInfo();

    initialiseScene();
    initialiseControls();

     
    PIEsetAreaOfInterest(-6, 6, 6, -6);
    PIEscene.background=new THREE.Color( 0xDFE3D4 );
    initialiseOtherVariables();

    // geometry=new THREE.PlaneGeometry(33,17);
    // back=createMesh(geometry,"back2.png");
    // back.position.set(0,0,-5);
    // PIEaddElement(back);
    // PIErender();

    // geometry=new THREE.PlaneGeometry(1.5,1.5);
    // dustbin=createMesh(geometry,"dustbin.png");
    // dustbin.position.set(-7.3,-4.1,5);
    // PIEaddElement(dustbin);
    // PIErender();
    
    //adding inclined plane
    var material = new THREE.LineBasicMaterial({color: 0x000000,linewidth:3});
    var geometry = new THREE.Geometry();
    var v1 = new THREE.Vector3(v1x,v1y,0);   // Vector3 used to draw a line from given point to next point
    var v2 = new THREE.Vector3(v2x,v2y,0);
    var v3 = new THREE.Vector3(v3x,v3y,0);   
    var v4 = new THREE.Vector3(v1x,v1y,0);// same as first point to connect with third point (to form triangle)
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);
    Inclinedplane = new THREE.Line( geometry, material );
    Inclinedplane.visible=true;
    PIEaddElement(Inclinedplane);


    //background color for inclined plane
    var planecolor = new THREE.Shape();
    planecolor.moveTo(v1x,v1y,0);
    planecolor.lineTo(v2x,v2y,0);
    planecolor.lineTo(v3x,v3y,0);
    planecolor.lineTo(v1x,v1y,0);
    modelplane = new THREE.Mesh(new THREE.ShapeGeometry(planecolor), new THREE.MeshBasicMaterial({color:0xC78305}));
    modelplane.visible = true;
    PIEaddElement(modelplane);


    //adding cylinder 
    cenx=v1x-(0.5*Math.sin(angle*((Math.PI)/180)));
    ceny=v1y+(0.5*Math.cos(angle*((Math.PI)/180)));
    var geometry = new THREE.CircleGeometry( 0.5, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    cylinder = new THREE.Mesh( geometry, material );
    cylinder.visible=true;
    PIEaddElement(cylinder);
    cylinder.position.set(cenx,ceny,0);
    PIEdragElement(cylinder);
    PIEsetDrag(cylinder, myBallDrag);


    //(actually this base unvisible bench png is overlapped)
    //base
    var material1 = new THREE.LineBasicMaterial({color: 0xffffff});
    var geometry = new THREE.Geometry();
    var B1 = new THREE.Vector3(5.5,-3.5,0);   // Vector3 used to draw a line from given point to next point
    var B2 = new THREE.Vector3(5.5,-4,0);
    var B3 = new THREE.Vector3(-7.5,-4,0);   
    var B4 = new THREE.Vector3(-7.5,-3.5,0);
    var B5 = new THREE.Vector3(5.5,-3.5,0);// same as first point to connect with third point
    geometry.vertices.push(B1);
    geometry.vertices.push(B2);
    geometry.vertices.push(B3);
    geometry.vertices.push(B4);
    geometry.vertices.push(B5);
    base = new THREE.Line( geometry, material1 );
    PIEaddElement(base);
 
   //background color for base
    basecolor = new THREE.Shape();
    basecolor.moveTo(5.5,-3.5,0);
    basecolor.lineTo(5.5,-4,0);
    basecolor.lineTo(-7.5,-4,0);
    basecolor.lineTo(-7.5,-3.5,0);
    basecolor.lineTo(5.5,-3.5,0);
    var modelbase = new THREE.Mesh(new THREE.ShapeGeometry(basecolor), new THREE.MeshBasicMaterial({color:0x29364B}));
    modelbase.visible = true;
    PIEaddElement(modelbase);


    //board png
    geometry=new THREE.PlaneGeometry(13,6.5);
    board=createMesh(geometry,"BLACKBOARD1.png");
    board.position.set(-5.3,2.5,0);
    board.material.color.setHex(0xffffff);
    PIEaddElement(board);
    PIErender();

    //bench png
    geometry=new THREE.PlaneGeometry(16,4);
    bench=createMesh(geometry,"bench.png");
    bench.position.set(-0.5,-5.1,0);
    PIEaddElement(bench);
    PIErender();


    


    //adding text
    var materialFront = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var materialSide = new THREE.MeshBasicMaterial( { color: 0xffffff} );
    var materialArray = [ materialFront, materialSide ];
    var loader = new THREE.FontLoader();






  
     // document.getElementsByClassName("dg main a").style.width=300px;
    PIEstartAnimation();

        
}



function createMesh(geom, imageFile) {
       var texture = new THREE.TextureLoader().load(imageFile);
       var mat = new THREE.MeshBasicMaterial();
       mat.map = texture;
       mat.transparent = true;
       mat.map.needsUpdate = true;
       var mesh = new THREE.Mesh(geom, mat);PIErender();
       PIErender();
       return mesh;

}

var play=1;

function updateExperimentElements(t, dt){
    var boundary=dt/1000*0.6;
    var play_time = t/1000;

    
    if(play == 0){
        
        initialiseOtherVariables();
    fstatic=m*g*(Math.sin(angle*((Math.PI)/180)));
    PIEchangeDisplayText("angle", angle);
    
    if (angle==0 ) {
            PIEchangeDisplayText("final Velocity", "0");
            fslide="0";
            froll="0";
            PIEchangeDisplayText("static force", fstatic);
            PIEchangeDisplayText("sliding force", fslide);
            PIEchangeDisplayText("rolling force", froll);
            cylinder.position.set(cylinder.position.x,cylinder.position.y,0); 
            PIEchangeDisplayText("Status", "No motion(static position)");

            }  


     else if (angle>=(Math.atan(3*u)*180/Math.PI)){
            PIEchangeDisplayText("Status", "intially slides then rolls");  
            accnet=(1/3)*g*Math.sin(angle*((Math.PI)/180));
            accx=(1/3)*g*Math.sin(2*angle*((Math.PI)/180));
            vx=vx+(accx*(boundary));
            accy=(2/3)*g*(Math.sin(angle*((Math.PI)/180)))*(Math.sin(angle*((Math.PI)/180)));
            vy=vy+(accy*(boundary));
            var velnet=Math.sqrt((vx*vx)+(vy*vy));
            //fstatic=0;
            fstatic=m*g*(Math.sin(angle*((Math.PI)/180)));
            fslide=m*accnet;
            fstatic=precisionRound(fstatic, 3);
            fslide=precisionRound(fslide, 3);
            froll="negligible value";
            PIEchangeDisplayText("static force", fstatic);
            PIEchangeDisplayText("sliding force", fslide);
            PIEchangeDisplayText("rolling force", froll);
            upx=cylinder.position.x;
            upy=cylinder.position.y;
            upx=upx-(vx*(boundary))-(0.5*accx*(boundary)*(boundary));
            upy=upy-(vy*(boundary))-(0.5*accy*(boundary)*(boundary));
        
            if(cylinder.position.x<= -7){
                cylinder.position.set(cylinder.position.x,cylinder.position.y,0);
                PIEstopAnimation();
                         }

            else if(cylinder.position.y<=-3){
                uppx=cylinder.position.x-(vx/2*(boundary))-(0.5*0*(boundary)*(boundary));
                // uppx=upx-(vx*(boundary))-(0.5*accnet*(boundary)*(boundary));
                //  var uppy=upy-(vy*(boundary))-(0.5*accnet*(boundary)*(boundary));
                cylinder.position.set(uppx - (Math.cos(0*((Math.PI)/180)))*boundary,cylinder.position.y-(Math.sin(0*((Math.PI)/180)))*boundary,0); 
                 }

            else {
                velnet=precisionRound(velnet, 3);
                PIEchangeDisplayText("final Velocity", velnet);
                cylinder.position.set(upx - (Math.cos(angle*((Math.PI)/180)))*boundary,upy-(Math.sin(angle*((Math.PI)/180)))*boundary,0);  
                } 
           

        }

 else {
            PIEchangeDisplayText("Status", "rolling"); 
            accnet=(1/3)*g*Math.sin(angle*((Math.PI)/180));
            accx=(1/3)*g*Math.sin(2*angle*((Math.PI)/180));
            vx=vx+(accx*(boundary));
            accy=(2/3)*g*(Math.sin(angle*((Math.PI)/180)))*(Math.sin(angle*((Math.PI)/180)));
            vy=vy+(accy*(boundary));
            var velnet=Math.sqrt((vx*vx)+(vy*vy));
             //fstatic=0;
            //  fslide=0;
            fstatic=m*g*(Math.sin(angle*((Math.PI)/180)));
            fslide="-";
            froll=m*accnet/2;
            fstatic=precisionRound(fstatic, 3);
            froll=precisionRound(froll, 3);
             PIEchangeDisplayText("static force", fstatic);
            PIEchangeDisplayText("sliding force", fslide);
            PIEchangeDisplayText("rolling force", froll);
             upx=cylinder.position.x;
             upy=cylinder.position.y;
            upx=upx-(vx*(boundary))-(0.5*accx*(boundary)*(boundary));
            upy=upy-(vy*(boundary))-(0.5*accy*(boundary)*(boundary));
        
        if(cylinder.position.x<= -7){

            cylinder.position.set(cylinder.position.x,cylinder.position.y,0);
            PIEstopAnimation();

                         }

        else if(cylinder.position.y<=-3){
            uppx=cylinder.position.x-(vx/2*(boundary))-(0.5*0*(boundary)*(boundary));
            cylinder.position.set(uppx - (Math.cos(0*((Math.PI)/180)))*boundary,cylinder.position.y-(Math.sin(0*((Math.PI)/180)))*boundary,0); 
        
                 }      
        else {
            velnet=precisionRound(velnet, 3);
PIEchangeDisplayText("final Velocity", velnet);
            cylinder.position.set(upx - (Math.cos(angle*((Math.PI)/180)))*boundary,upy-(Math.sin(angle*((Math.PI)/180)))*boundary,0); 
        
        } 

}

    }

    

     if(play_time >= 0.4&&play==1){
        PIEstopAnimation();
        play=0;

        
        }

}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function myBallDrag(element, newpos)
{

    initialiseOtherVariables();
    vx=0;
    vy=0;
    cenx=newpos.x;
    ceny=newpos.y;
    // d=((newpos.x-v1x)*(v3y-v1y-0.5))-((newpos.y-v1y-0.5)*(v3x-0.5-v1x));
    // a=v3y-v1y-0.5;
    // b=-(v3x-0.5-v1x);
    // c=((v1y+0.5)*(v3x-0.5-v1x))-((v1x)*(v3y-v1y-0.5));
    vard=((newpos.x-v1x+(0.5*Math.sin(angle*((Math.PI)/180))))*(v3y-v1y)) - ((newpos.y-v1y-(0.5*Math.cos(angle*((Math.PI)/180))))*(v3x-v1x));
    vara=(v3y-v1y);
    varb=-(v3x-v1x);
    varc=( ((v1y+(0.5*Math.cos(angle*((Math.PI)/180))))*(v3x-v1x)) - ((v1x-(0.5*Math.sin(angle*((Math.PI)/180))))*(v3y-v1y)));

    if(vard==0){
        cenx=newpos.x;
        ceny=newpos.y;
    }
    else {
        cenx=((-vara)*(vara*newpos.x+varb*newpos.y+varc)/(vara*vara+varb*varb))+newpos.x;
        ceny=((-varb)*(vara*newpos.x+varb*newpos.y+varc)/(vara*vara+varb*varb))+newpos.y;
    }


    if(cenx>(v1x-(0.5*Math.sin(angle*((Math.PI)/180))))){
        cenx=v1x-(0.5*Math.sin(angle*((Math.PI)/180)));
    }

    else if (cenx<(v3x-(0.5*Math.sin(angle*((Math.PI)/180))))) {
        cenx=(0.5*Math.sin(angle*((Math.PI)/180)))+0.05;
    }

    if (ceny>(v1y+(0.5*Math.cos(angle*((Math.PI)/180))))) {
        ceny=(v1y+(0.5*Math.cos(angle*((Math.PI)/180))));
    }
    else if (ceny<(v3y+(0.5*Math.cos(angle*((Math.PI)/180))))) {
        ceny=(v3y+(0.5*Math.sin(angle*((Math.PI)/180))))+0.25;
    }
    
    cylinder.position.set(cenx,ceny,0);
}


function anglechange(){

        initialiseOtherVariables();
        Inclinedplane.visible=false;
        modelplane.visible=false;
        vx=0;
        vy=0;
        var material = new THREE.LineBasicMaterial({color: 0x000000,linewidth:3});
        var geometry = new THREE.Geometry();
        var v1 = new THREE.Vector3(v1x,v1y,0);  
        var v2 = new THREE.Vector3(v2x,v2y,0);
        var v3 = new THREE.Vector3(v3x,v3y,0);   
        var v4 = new THREE.Vector3(v1x,v1y,0);// same as first point to connect with third point
        geometry.vertices.push(v1);
        geometry.vertices.push(v2);
        geometry.vertices.push(v3);
        geometry.vertices.push(v4);
        Inclinedplane = new THREE.Line( geometry, material );
        Inclinedplane.visible=true;
        PIEaddElement(Inclinedplane);
        PIErender();


        //background color for inclined plane
        if (angle!=0) {
        var planecolor = new THREE.Shape();
        planecolor.moveTo(v1x,v1y,0);
        planecolor.lineTo(v2x,v2y,0);
        planecolor.lineTo(v3x,v3y,0);
        planecolor.lineTo(v1x,v1y,0);
        modelplane = new THREE.Mesh(new THREE.ShapeGeometry(planecolor), new THREE.MeshBasicMaterial({color:0xC78305}));
        modelplane.visible = true;
        PIEaddElement(modelplane);
        PIErender();
            }

        cylinder.visible=false;
        cenx=v1x-(0.5*Math.sin(angle*((Math.PI)/180)));
        ceny=v1y+(0.5*Math.cos(angle*((Math.PI)/180)));
        var geometry = new THREE.CircleGeometry( 0.5, 100 );
        var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        cylinder = new THREE.Mesh( geometry, material );
        cylinder.visible=true;
        PIEaddElement(cylinder);
        cylinder.position.set(cenx,ceny,0); 
        PIEdragElement(cylinder);
        PIEsetDrag(cylinder, myBallDrag);
        PIErender();
 
}


function initialiseControls(){
      initialiseOtherVariables();
      //input panel
      PIEaddInputSlider("angle", 30, anglechange, 0, 50, 0.1);   
      //document.getElementsByTagName("li").style.width="260px";
      //document.getElementsByTagName("li").style.font-size="18px";
     //display panel
      PIEaddDisplayText("angle",angle);
      PIEaddDisplayText("coeff friction","0.3");
      PIEaddDisplayText("Status","");
      PIEaddDisplayText("final Velocity","0");
      PIEaddDisplayText("static force","0");
      PIEaddDisplayText("sliding force","0");
      PIEaddDisplayText("rolling force","0");


}


function initialiseOtherVariables(){
    angle=PIEgetInputSlider("angle");
    v1x=5.5;
    v2x=5.5;
    v2y=-3.5;
    v3x=0.5;
    v3y=-3.5;
    v1y=(((5)*Math.tan(angle*((Math.PI)/180)))-3.5);
    
}


function resetExperiment(){
    PIEchangeInputSlider("angle", 30);
    initialiseOtherVariables();
    Inclinedplane.visible=false;
    modelplane.visible=false;
    vx=0;
    vy=0;

    var material = new THREE.LineBasicMaterial({color: 0x000000,linewidth:3});
    var geometry = new THREE.Geometry();
    var v1 = new THREE.Vector3(v1x,v1y,0);   // Vector3 used to specify position
    var v2 = new THREE.Vector3(v2x,v2y,0);
    var v3 = new THREE.Vector3(v3x,v3y,0);   
    var v4 = new THREE.Vector3(v1x,v1y,0);// same as first point to connect with third point
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);
    Inclinedplane = new THREE.Line( geometry, material );
    Inclinedplane.visible=true;
    PIEaddElement(Inclinedplane);
    PIErender();

    //background color for inclined plane
    if (angle!=0) {
    var planecolor = new THREE.Shape();
    planecolor.moveTo(v1x,v1y,0);
    planecolor.lineTo(v2x,v2y,0);
    planecolor.lineTo(v3x,v3y,0);
    planecolor.lineTo(v1x,v1y,0);
    modelplane = new THREE.Mesh(new THREE.ShapeGeometry(planecolor), new THREE.MeshBasicMaterial({color:0xC78305}));
    modelplane.visible = true;
    PIEaddElement(modelplane);
    PIErender();
            }

    //cylinder 
    // PIEremoveElement(cylinder);
    cylinder.visible=false;
    // cenx=v1x-0.2;
    // ceny=v1y+0.5;
    cenx=v1x-(0.5*Math.sin(angle*((Math.PI)/180)));
    ceny=v1y+(0.5*Math.cos(angle*((Math.PI)/180)));
    
    // cenx=v1x-((0.6)*(Math.cos(angle*((Math.PI)/180))));
    // ceny=v1y+0.5-((0.6)*(Math.sin(angle*((Math.PI)/180))));
    var geometry = new THREE.CircleGeometry( 0.5, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    cylinder = new THREE.Mesh( geometry, material );
    cylinder.visible=true;
    PIEaddElement(cylinder);
    cylinder.position.set(cenx,ceny,0);
    PIEdragElement(cylinder);
    PIEsetDrag(cylinder, myBallDrag);
    PIErender();

}

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Types of friction</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows different types of friction for a cylinder placed on an inclined palne.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. Intially you need to give input in angle slider(top right corner).</p>";
    helpContent = helpContent + "<h3>Working stage</h3>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>coefficient of friction = 0.3";
    helpContent = helpContent + "<li>mass of cylinder = 2kg";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>The experiment works on parameter of angle of wedge.</p>";
    helpContent = helpContent + "<p>If angle=0 then mgsin(0)=0 so static friction is balanced by mgsin0 and normal reaction balanced by mgcos0 resulting the cylinder in rest.</p>";
    helpContent = helpContent + "<p>torque(T)=I*alpha</p>";
    helpContent = helpContent + "<p>F*r=1/2*m*r^2*(accelaration/r)</p>";
    helpContent = helpContent + "<p>(umgcos(angle))*r=(m/2)*r^2*(accelaration)/r</p>";
    helpContent = helpContent + "<p>(umgcos(angle))*r=(m/2)*r^2*((2/3)*g* sin(angle))/r</p>";
    helpContent = helpContent + "<p>umgcos(angle)=(m/2)*(2/3)*g* sin(angle)</p>";
    helpContent = helpContent + "<p>tan(angle)=3u</p>";
    helpContent = helpContent + "<p>If you change the angle such that 0 < angle < taninverse(3u) then cylinder begins to roll. There you can understand that the cylinder rolls even for a slight angle.</p>";
    helpContent = helpContent + "<p>If you change the angle such that angle>taninverse(3u). Then cylinder intially slides(slips) afterwords performs uniform rolling.</p>";
    helpContent = helpContent + "<h3>Observation stage</h3>";
    helpContent = helpContent + "<p>On observing static friction, sliding friction, rolling friction forces for different angles it shows that static friction force is always greater than sliding friction force and sliding friction force is always greater than rolling friction force</p>";
    helpContent = helpContent + "<p></p>";
    helpContent = helpContent + "<p></p>";
    helpContent = helpContent + "<p></p>";
    helpContent = helpContent + "<h4>Conclusion</h4>";
    helpContent = helpContent + "<p>Static friction force > sliding friction force > rolling friction force</p>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment is about Different types of friction.</p>";
    infoContent = infoContent + "<h3>Static Friction</h3>";
    infoContent = infoContent + "<p>Static friction acts on objects when they are resting on a surface. For example, if you are hiking in the woods, there is static friction between your shoes and the trail each time you put down your foot. Without this static friction, your feet would slip out from under you, making it difficult to walk</p>";
    infoContent = infoContent + "<h3>Sliding Friction</h3>";
    infoContent = infoContent + "<p>Sliding friction is friction that acts on objects when they are sliding over a surface. Sliding friction is weaker than static friction. That’s why it’s easier to slide a piece of furniture over the floor after you start it moving than it is to get it moving in the first place. Sliding friction can be useful.</p>";
    infoContent = infoContent + "<h3>Rolling Friction</h3>";
    infoContent = infoContent + "<p>Rolling friction is friction that acts on objects when they are rolling over a surface. Rolling friction is much weaker than sliding friction or static friction. This explains why most forms of ground transportation use wheels, including bicycles, cars, 4-wheelers, roller skates, scooters, and skateboards.</p>";
   // infoContent = infoContent + "<ul><li> </li></ul>";
    infoContent = infoContent + "<h3>Static friction is greater than sliding friction</h3>";
    infoContent = infoContent + "<p>The friction is due to interlocking of irregularities in two surfaces. when the object starts sliding the contact points on its surface, do not get enough time to lock into the contact points on the floor. So the sliding friction is slightly less than static friction</p>";
    infoContent = infoContent + "<h3>Sliding friction is greater than rolling friction</h3>";
    infoContent = infoContent + "<p>Rolling friction is the force resisting the motion when a body (such as a ball, tire, or wheel) rolls on a surface. Sliding friction is the force resisting the motion when a body slides on a surface. The force of friction depends on the area of contact between the two surfaces. As the area of contact is less in the case of rolling than in the case of sliding, rolling friction is less than the sliding frictio</p>";
    infoContent = infoContent + "<h3> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Static friction > sliding friction > rolling friction</h3>";
    PIEupdateInfo(infoContent);
}

















function PIEsetDragStart(a, b) {
    a.dragStart = b
}
function PIEsetDrag(a, b) {
    a.drag = b
}
function PIEsetDragEnd(a, b) {
    a.dragEnd = b
}

var PIEdragElements = [];
function PIEdragElement(a) {
    PIEdragElements.push(a)
}
function PIEremoveDragElement(b) {
    var a;
    var c;
    c = false;
    for (a = 0; (c == false) && (a < PIEdragElements.length); a++) {
        if (PIEdragElements[a] == b) {
            c = true
        }
    }
    if (c == true) {
        while (a <= PIEdragElements.length) {
            PIEdragElements[a - 1] = PIEdragElements[a];
            a++
        }
        PIEdragElements.pop()
    }
}


function PIEremoveElement(b) {
    var a;
    var c;
    PIEscene.remove(b);
    c = false;
    for (a = PIEsceneElements.length - 1; (c == false) && (a >= 0); a--) {
        if (b == PIEsceneElements[a]) {
            while (a < PIEsceneElements.length - 1) {
                PIEsceneElements[a] = PIEsceneElements[a + 1];
                a++
            }
            PIEsceneElements.pop();
            c = true
        }
    }
}