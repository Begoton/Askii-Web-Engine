const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth - 250;
canvas.style.float = 'right';
canvas.id = 'canvas';   
Main.canvas = canvas;
document.body.appendChild(canvas); 
let KeyCodeDown = 
{
    'w':false,
    's':false,
    'a':false,
    'd':false,
}
window.addEventListener('load', e => 
{
    START_SYSTEM();
})
canvas.addEventListener('mousemove', e => 
{
    Client.MouseX = e.clientX;
    Client.MouseY = e.clientY;
})
window.addEventListener('keydown', e => 
{
    switch(e.key)
    {
        case 'w':
            KeyCodeDown.w = true;
            break;
        case 's':
            KeyCodeDown.s = true;
            break;
        case 'a':
            KeyCodeDown.a = true;
            break;
        case 'd':
            KeyCodeDown.d = true;
            break;
    }
})
window.addEventListener('keyup', e => 
{
    switch(e.key)
    {
        case 'w':
            KeyCodeDown.w = false;
            break;
        case 's':
            KeyCodeDown.s = false;
            break;
        case 'a':
            KeyCodeDown.a = false;
            break;
        case 'd':
            KeyCodeDown.d = false;
            break;
    }
})
// Camera       
const Camera = 
{
    position:{x: 0, y: 0, z: -10},
    rotation:{x: 0, y: 0, z: 0},
    fov:45,
    target:{x: 0, y: 0, z: 1},
}
// World
const World = 
{
    color:[0.2, 0.2, 0.2, 1.0],
}
// Time
const Time = 
{
    currentTime:null,
    lastTime:null,
    deltaTime:null,
}
// Buffers
let ALL_OBJECTS = [];
let EDITOR_BUFFER = []; 
let MAIN_BUFFER = [];
let COMPONENT_UPDATE_BUFFER = [];
// System
const System = 
{
    FPS: null,
    Frames: 0,
    
}
const Client = 
{
    MouseX: null,
    MouseY: null,
}

const Cladd = 
{
    Add(component, buffer)
    {
        buffer.push(component);
    },
    RENDER_BUFFER(buffer)
    {
        for(let i = 0; i < buffer.length; i++)
        {
            if(buffer[i] != null && buffer[i].draw() != undefined) {
                buffer[i].draw();
            }
        }
    },  
    UPDATE_BUFFER(buffer)
    {   
        for(let i = 0; i < buffer.length; i++)
        {
            buffer[i].draw();
        }
    },
    canvasToWebGL(x, y)
    {
        var clipX = (2 * x) / canvas.width - 1;
        var clipY = 1 - (2 * y) / canvas.height;
        return { x: clipX, y: clipY };
    },
}
// Shaders
let vertex = 
`
    precision mediump float;
    attribute vec3 vPosition;
    attribute vec3 vColor;
    varying vec3 fragColor;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    void main(){
        fragColor = vColor;
        gl_Position = mProj * mView * mWorld * vec4(vPosition, 1.0);
    }
`;

let fragment = 
`
    precision mediump float;
    varying vec3 fragColor;
    void main(){
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;
// UI shaders
let vertex2 = 
`
    precision mediump float;
    attribute vec2 vPosition;
    attribute vec4 vColor;
    varying vec4 fragColor;
    void main(){
        fragColor = vColor;
        gl_Position = vec4(vPosition, 0.0, 1.0);
    }
`;

let fragment2 = 
`
    precision mediump float;
    varying vec4 fragColor;
    void main(){
        gl_FragColor = fragColor;
    }
`;

// WebGL - 
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
let program = gl.createProgram();
let buffer = gl.createBuffer();
let buffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer2);

gl.shaderSource(vertexShader, vertex);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);
if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
{
    console.error('Vertex shader - ' + gl.getShaderInfoLog(vertexShader));
}
if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
{
    console.error('Vertex shader - ' + gl.getShaderInfoLog(fragmentShader));
}
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if(!gl.getProgramParameter(program, gl.LINK_STATUS))
{
    console.error('Program not linked - ' + gl.getProgramInfoLog(program));
}
gl.useProgram(program);     
gl.viewport(0, 0, canvas.width, canvas.height); 
gl.clearColor(0.1, 0.2, 0.3, 1.0);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
// UI SHADER SETUP ************************************************
let vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vertexShader2, vertex2);
gl.shaderSource(fragmentShader2, fragment2);
gl.compileShader(vertexShader2);
gl.compileShader(fragmentShader2);
if(!gl.getShaderParameter(vertexShader2, gl.COMPILE_STATUS))
{
    console.error('Vertex shader2 - ' + gl.getShaderInfoLog(vertexShader2));
}
if(!gl.getShaderParameter(fragmentShader2, gl.COMPILE_STATUS))
{
    console.error('Vertex shader2 - ' + gl.getShaderInfoLog(fragmentShader2));
}

let verts = 
[
    -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.5, 0.0, 0.0, 0.0, 1.0,
];  

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
// Attributes
let vPositionLoc = gl.getAttribLocation(program, 'vPosition');
let vColorLoc = gl.getAttribLocation(program, 'vColor');
gl.enableVertexAttribArray(vPositionLoc);
gl.enableVertexAttribArray(vColorLoc);
gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 6 * 4, 0);
gl.vertexAttribPointer(vColorLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

// Uniform matrix
let mWorldLoc = gl.getUniformLocation(program, 'mWorld');
let mViewLoc = gl.getUniformLocation(program, 'mView');
let mProjLoc = gl.getUniformLocation(program, 'mProj');

let mWorld = new Float32Array(16);
let mView = new Float32Array(16);
let mProj = new Float32Array(16);
let mId = new Float32Array(16);

mat4.identity(mWorld);
mat4.identity(mId);
mat4.lookAt(mView, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
mat4.perspective(mProj, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000);

gl.uniformMatrix4fv(mWorldLoc, false, mWorld);
gl.uniformMatrix4fv(mViewLoc, false, mView);
gl.uniformMatrix4fv(mProjLoc, false, mProj);
// Rotate world
function RotateWorld()
{
    
}
// DeltaTime values
Time.lastTime = performance.now();
function updateCamera()
{
    let position = vec3.create();
    let target = vec3.create();
    let up = vec3.create();
    // Set position of camera
    vec3.set(position, Camera.position.x, Camera.position.y, Camera.position.z);
    // Set target of camera
    vec3.set(target, Camera.target.x, Camera.target.y, Camera.target.z);
    // Set normal up direction: Y Axis
    vec3.set(up, 0, 1, 0);
    // Apply data
    mat4.lookAt(mView, position, target, up);
    mat4.perspective(mProj, glMatrix.toRadian(Camera.fov), canvas.width / canvas.height, 0.1, 1000);
    gl.uniformMatrix4fv(mWorldLoc, false, mWorld);
    gl.uniformMatrix4fv(mViewLoc, false, mView);
    gl.uniformMatrix4fv(mProjLoc, false, mProj);
    
}

function system()   
{
    RotateWorld();
    // Update camera    
    updateCamera();
    // Calculate ∆t
    Time.currentTime = performance.now();
    Time.deltaTime = (Time.currentTime - Time.lastTime) / 1000;
    Time.lastTime = Time.currentTime;        
    gl.clearColor(...World.color);  
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    Cladd.UPDATE_BUFFER(COMPONENT_UPDATE_BUFFER);
    update();
    Cladd.RENDER_BUFFER(EDITOR_BUFFER);
    Cladd.RENDER_BUFFER(MAIN_BUFFER);
    Cladd.RENDER_BUFFER(EDITOR_BUFFER);
    requestAnimationFrame(system);      
}    

function update()        
{                       
    
}
system();
// End of render pipeline