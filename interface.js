let SELECTED_CLADD_SCRIPT;
let tab = false;
let movementAmount = 1;
let ALL_PREFABS = [];
let prefabs_test = localStorage.getItem('_Prefabs');
if(prefabs_test != null)
{
    ALL_PREFABS = JSON.parse(localStorage.getItem('_Prefabs'));
}

// CUSTOM ATTRIBUTES
let Materials = [];
// Modes = l: location, r: rotation, s: scale
let movementMode = 'l';
const Main = 
{
    mouseX: null,
    mouseY: null,   
    canvas: null,
}
// Open menu manually
document.getElementById('smenu').onclick = () => 
{
    document.getElementById('menu').style.display = 'block';
}
// Delete class
document.getElementById('delete').onclick = () => 
{
    let objectIndex = document.getElementById('selected_class').value;
    ALL_OBJECTS.splice(objectIndex - 1, 1);
    let index = document.getElementById('selected_class').selectedIndex;
    let node = document.getElementById('selected_class').options[index];
    document.getElementById('selected_class').removeChild(node);
}
window.onload = () => 
{
    UpdateInterfaceFromWorld();
    InputFromCamera();
} 
window.addEventListener('keydown', e => 
{   
    switch(e.key)
    {   
        case 'Tab':
            e.preventDefault();
            if(movementMode == 'l')
            {
                movementMode = 'r';
                document.getElementById('moveMode').innerHTML = "Movement Mode: Rotation";
                document.getElementById('moveMode').style.color = 'red';
            } else if(movementMode == 'r')
            {
                movementMode = 's';
                document.getElementById('moveMode').innerHTML = "Movement Mode: Scale";
                document.getElementById('moveMode').style.color = 'Blue';
            } else
            {
                movementMode = 'l';
                document.getElementById('moveMode').innerHTML = "Movement Mode: Position";
                document.getElementById('moveMode').style.color = 'lime';
            }
            break;
        case 'ArrowUp':
            ObjectChange('up');
            break;
        case 'ArrowDown':
            ObjectChange('down');
            break;
        case 'ArrowLeft':
            ObjectChange('left');
            break;
        case 'ArrowRight':
            ObjectChange('right');
            break;
        
    }
})  
// INTERFACE DEFAULTS
let OBJECTS = false;
let inspectorActive = false;
let worldTab = false;
let systemTab = false;
let prefabs = false;
function START_SYSTEM()
{
    Main.canvas.addEventListener('contextmenu', e => 
    {
        e.preventDefault();
    })
    Main.canvas.addEventListener('mousemove', e => 
    {   
        Main.mouseX = e.clientX;
        Main.mouseY = e.clientY;
    })  
    Main.canvas.addEventListener('mousedown', e => 
    {
        if(e.button === 2)
        {
            document.getElementById('menu').style.left = Main.mouseX + 'px';
            document.getElementById('menu').style.top = Main.mouseY + 'px';
            document.getElementById('menu').style.display = 'block';
        } else 
    {
        
    }
})
}

// END DEFAULTS

// IIE - Interface Interaction Events
document.getElementById('add_triangle').onclick = () => {AddObject('triangle')};
document.getElementById('add_plane').onclick = () => {AddObject('plane')};
document.getElementById('name').addEventListener('keydown', e => 
{
    if(e.key == 'Enter') document.getElementById("SELECT" + document.getElementById('selected_class').value).innerHTML = document.getElementById('name').value;
})
document.getElementById('objects').onclick = () => 
{
    if(!OBJECTS)
    {
        OBJECTS = true;
        document.getElementById('object').style.height = '0px';
    } else 
    {   
        OBJECTS = false;
        document.getElementById('object').style.height = '80%';
    }
}
document.getElementById('toggle_world').onclick = () => 
{
    if(!worldTab)
    {
        worldTab = true;
        document.getElementById('world').style.height = '450px';
    } else 
    {
        worldTab = false;
        document.getElementById('world').style.height = '0px';
    }
}
document.getElementById('toggle_system').onclick = () => 
{
    if(!systemTab)
    {   
        systemTab = true;
        document.getElementById('system').style.height = '450px';
    } else 
    {
        systemTab = false;
        document.getElementById('system').style.height = '0px';
    }
}
// Open vertex data log
document.getElementById('OPEN_VERTEX_DATA_LOG').onclick = () => 
{
    document.getElementById('objectDataLog').style.display = 'block';
    let component = ALL_OBJECTS[document.getElementById('selected_class').value - 1];
    let positions = []; 
    for(let i = 0; i < component.data.length; i += 6)
    {   
        let x = component.data[i];
        let y = component.data[i+1];
        let z = component.data[i+2];
        positions.push(x, y, z);
    }
    document.getElementById('rawVertexData').value = positions;
    document.getElementById('matandpos').value = component.data;
    document.getElementById('totalVertices').innerHTML = 'Total vertices: ' + component.data.length / 6;
    document.getElementById('totalElements').innerHTML = 'Vertex array length: ' + component.data.length;
}
// Open prefab tool
document.getElementById('toggle_prefabs').onclick = () => 
{
    if(!prefabs)
    {
        prefabs = true;
        document.getElementById('prefabs').style.height = '400px';
    } else 
    {
        prefabs = false;
        document.getElementById('prefabs').style.height = '0px';
    }
}

// Methods
function AddObject(type)
{
    switch(type)
    {
        case 'triangle':
            const triangle = new Triangle();
            Cladd.Add(triangle, EDITOR_BUFFER);
            Cladd.Add(triangle, ALL_OBJECTS);
            triangle.name = "Triangle - GA " + ALL_OBJECTS.length;
            AddToSystem(triangle);
            break;
        case 'plane':
            const plane = new Plane();
            Cladd.Add(plane, EDITOR_BUFFER);
            Cladd.Add(plane, ALL_OBJECTS);
            plane.name = "Plane - GA " + ALL_OBJECTS.length;
            AddToSystem(plane);
            break;
        case 'circle':
            const circle = new Circle();
            Cladd.Add(circle, EDITOR_BUFFER);
            Cladd.Add(circle, ALL_OBJECTS);
            circle.name = "Circle - GA " + ALL_OBJECTS.length;
            AddToSystem(circle);
            break;
        case 'sphere':
            const sphere = new Sphere();
            Cladd.Add(sphere, EDITOR_BUFFER);
            Cladd.Add(sphere, ALL_OBJECTS);
            sphere.name = "Sphere - GA " + ALL_OBJECTS.length;
            AddToSystem(sphere);
            break;
        case 'box':
            const box = new Box();
            Cladd.Add(box, EDITOR_BUFFER);
            Cladd.Add(box, ALL_OBJECTS);
            box.name = "Box - GA " + ALL_OBJECTS.length;
            AddToSystem(box);
            break;
        case 'terrain': 
            const terrain = new Terrain();
            Cladd.Add(terrain, EDITOR_BUFFER);
            Cladd.Add(terrain, ALL_OBJECTS);
            terrain.name = "Terrain - GA " + ALL_OBJECTS.length;
            AddToSystem(terrain);
            break;
        case 'custom':
            const custom = new CustomGeometry();
            Cladd.Add(custom, EDITOR_BUFFER);
            Cladd.Add(custom, ALL_OBJECTS);
            custom.name = "Custom Geometry - GL " + ALL_OBJECTS.length;
            AddToSystem(custom);
            break;
        case 'shell':
            const shell = new Shell();
            Cladd.Add(shell, EDITOR_BUFFER);
            Cladd.Add(shell, ALL_OBJECTS);
            shell.name = "Shell - GA " + ALL_OBJECTS.length;
            AddToSystem(shell);
            break;

    }
    document.getElementById('menu').style.display = 'none';
}
// End class creation ^
function SetDisplay(element, mode)
{
    document.getElementById(element).style.display = mode;
}
function AddToSystem(object)
{
    const option = document.createElement('option');
    option.innerHTML = object.name;
    option.value = ALL_OBJECTS.length;
    option.id = "SELECT" + ALL_OBJECTS.length;
    document.getElementById('selected_class').appendChild(option);
    const option2 = document.createElement('option');
    option2.innerHTML = object.name;
    option2.value = ALL_OBJECTS.length;  
    option2.id = "AIV_" + ALL_OBJECTS.length;
    document.getElementById("AIV").appendChild(option2);
}



// INSPECTOR ***********************************************
document.getElementById('selected_class').addEventListener('change', e => 
{
    DisplayInfo();
})

// This takes all of the data from the component class and diplays them in the inspector
document.getElementById('SI').onclick = () => {DisplayInfo();}
function DisplayInfo()  
{
    let component = ALL_OBJECTS[document.getElementById('selected_class').value - 1];
    // name
    Show('name', component.name);
    // position
    Show('x', component.position.x);
    Show('y', component.position.y);
    Show('z', component.position.z);
    // rotation
    Show('rotx', component.rotation.x);
    Show('roty', component.rotation.y);
    Show('rotz', component.rotation.z);
    // scale
    Show('scalex', component.scale.x);
    Show('scaley', component.scale.y);
    Show('scalez', component.scale.z);
    // Material
    Show('colorr', component.material[0]);
    Show('colorg', component.material[1]);
    Show('colorb', component.material[2]);
    
    // Custom geometry component
    if(component.previusPosition != undefined)
    {
        document.getElementById('customGeometryAttribs').style.display = 'block';
        Show('CGA_ghostMovement', component.movement);
        Show('CGA_data', component.data);
        if(component.active)
        {
            document.getElementById('CGA_active').checked = true;
        } else {document.getElementById('CGA_active').checked = false;}
    } else {document.getElementById('customGeometryAttribs').style.display = 'none'};
    if(component instanceof Shell)
    {
        document.getElementById('shellAttributes').style.display = 'block';
        document.getElementById('AIVdrawMode').value = component.drawMode;
        switch(component.drawMode)
        {
            case gl.LINES:
                document.getElementById('AIVdrawMode').value = '1';
                break;
            case gl.TRIANGLE_STRIP:
                document.getElementById('AIVdrawMode').value = '2';
                break;
            case gl.TRIANGLE_FAN:
                document.getElementById('AIVdrawMode').value = '3';
                break;
            case gl.TRIANGLES:
                document.getElementById('AIVdrawMode').value = '4';
                break;
        }
    } else {document.getElementById('shellAttributes').style.display = 'none'};
    if(!inspectorActive)
    {
        UpdateObject();
    }
}

function UpdateObject() 
{
    if(document.getElementById('selected_class').options.length == 0)
    {
        return;
    }
    inspectorActive = true;
    let component = ALL_OBJECTS[document.getElementById('selected_class').value - 1];
    component.name = document.getElementById('name').value;
    component.position.x = document.getElementById('x').value;
    component.position.y = document.getElementById('y').value;
    component.position.z = document.getElementById('z').value;

    component.rotation.x = document.getElementById('rotx').value;
    component.rotation.y = document.getElementById('roty').value;
    component.rotation.z = document.getElementById('rotz').value;

    component.scale.x = document.getElementById('scalex').value;
    component.scale.y = document.getElementById('scaley').value;
    component.scale.z = document.getElementById('scalez').value;

    component.material[0] = document.getElementById('colorr').value;
    component.material[1] = document.getElementById('colorg').value;
    component.material[2] = document.getElementById('colorb').value;

    Show('CGA_data', component.data);
    if(component.movement != undefined) {
        Show('ghostx', component.cursor.x);
        Show('ghosty', component.cursor.y);
        Show('ghostz', component.cursor.z); 
        component.movement = parseFloat(document.getElementById('CGA_ghostMovement').value);
        Show('CGA_data', component.data);
        if(document.getElementById('CGA_active').checked) component.active = true;
        else component.active = false;
    }
    // Draw mode
    switch(document.getElementById('AIVdrawMode').value)
    {
        case '1':
            component.drawMode = gl.LINES;
            break;
        case '2':
            component.drawMode = gl.TRIANGLE_STRIP;
            break;
        case '3':
            component.drawMode = gl.TRIANGLE_FAN;
            break;
        case '4':
            component.drawMode = gl.TRIANGLES;
            break;
    }
    requestAnimationFrame(UpdateObject);
}


// This allows for quicker information transfer
function Show(element, value)
{
    document.getElementById(element).value = value;
}

function Trans(val, element)
{
    val = document.getElementById(element).value;
}



// MAIN SYSTEM INTERVAL
const MSI = setInterval(() => 
{
    if(ALL_OBJECTS.length > 0)
    {
        document.getElementById("SI").style.display = 'block';
    }  else 
    {
        document.getElementById('SI').style.display = 'none';
    }
    // Update camera interface
    
}, 1000)

// Cladd Scripts
function NewCladdScript(value)
{
    let name = document.getElementById('CS_NAME').value;
    if(name == '')
    {
        alert("Cladd script must have a name.");
    } else 
    {
        const item = document.createElement('div');
        item.style.height = '100px';    
        item.style.width = '80px';
        item.style.backgroundColor = 'rgb(40, 40, 40)';
        item.style.color = 'lime';
        item.style.borderRadius = '10px';
        item.style.fontSize = '10px';
        item.innerHTML = name;
        item.style.margin = '5px';
        item.style.textAlign = 'center';
        item.style.boxShadow = '1px 1px 1px gray';
        item.style.transition = '300ms';
        item.content = value;
        item.addEventListener('mouseover', e => 
        {
            item.style.transform = 'scale(110%)';
            item.style.cursor = 'pointer';
        })
        item.addEventListener('mouseleave', e => 
        {
            item.style.transform = 'scale(100%)';
        })
        item.addEventListener('click', e => 
        {
            SetDisplay('CSEW','block');
            SELECTED_CLADD_SCRIPT = item;
            document.getElementById('CSEW_CONT').value = item.content;
        })
        document.getElementById('allcladdscripts').appendChild(item);
        document.getElementById('CS_NAME').value = '';
    }
}
// Compile script
document.getElementById('COMPILE_CURRENT_SCRIPT').onclick = () => 
{
    SELECTED_CLADD_SCRIPT.content = document.getElementById('CSEW_CONT').value;
    document.getElementById("CSEW").style.display = 'none';
}
// Setting Interface Attributes
function SetDisplay(element, mode)
{
    document.getElementById(element).style.display = mode;
}

// MAIN FILE SYSTEM **************************************
/*function CreateDownloadableFile(filename, content)
{
    const blob = new Blob([content], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}
*/
// Update System
function UpdateFromSystem()
{
    document.getElementById("QM_amount").value = movementAmount;
}
function UpdateToSystem()
{
    movementAmount = parseFloat(document.getElementById('QM_amount').value);
    setTimeout(() => {
        requestAnimationFrame(UpdateToSystem);
    }, 200)
    
}
UpdateFromSystem();
UpdateToSystem();
// Update world
function UpdateWorld()
{
    World.color[0] = document.getElementById('world_colorr').value;
    World.color[1] = document.getElementById('world_colorg').value;
    World.color[2] = document.getElementById('world_colorb').value;
    World.color[3] = document.getElementById('world_colora').value;
}
function UpdateInterfaceFromWorld()
{
    document.getElementById('world_colorr').value = World.color[0];
    document.getElementById('world_colorg').value = World.color[1];
    document.getElementById('world_colorb').value = World.color[2];
    document.getElementById('world_colora').value = World.color[3];
}
function ObjectChange(ArrowType)
{
    if(ArrowType == 'up')
    {
        switch(movementMode)
        {
            case 'l':
                let num1 = parseFloat(document.getElementById('y').value);
                document.getElementById('y').value = (num1 += movementAmount); 
                break;
            case 'r':
                let num2 = parseFloat(document.getElementById('roty').value);
                document.getElementById('roty').value = (num2 += movementAmount);
                break;
            case 's':
                let num3 = parseFloat(document.getElementById('scaley').value);
                document.getElementById('scaley').value = (num3 += movementAmount);
                break;
        }
    }
    if(ArrowType == 'down')
    {
        switch(movementMode)
        {
            case 'l':
                let num1 = parseFloat(document.getElementById('y').value);
                document.getElementById('y').value = (num1 -= movementAmount); 
                break;
            case 'r':
                let num2 = parseFloat(document.getElementById('roty').value);
                document.getElementById('roty').value = (num2 -= movementAmount);
                break;
            case 's':
                let num3 = parseFloat(document.getElementById('scaley').value);
                document.getElementById('scaley').value = (num3 -= movementAmount);
                break;
        }
    }
    if(ArrowType == 'left')
    {
        switch(movementMode)
        {
            case 'l':
                let num1 = parseFloat(document.getElementById('x').value);
                document.getElementById('x').value = (num1 += movementAmount);
                break;
            case 'r':
                let num2 = parseFloat(document.getElementById('rotx').value);
                document.getElementById('rotx').value = (num2 += movementAmount);
                break;
            case 's':
                let num3 = parseFloat(document.getElementById('scalex').value);
                document.getElementById('scalex').value = (num3 += movementAmount);
                break;
        }
    }
    if(ArrowType == 'right')
    {
        switch(movementMode)
        {
            case 'l':
                let num1 = parseFloat(document.getElementById('x').value);
                document.getElementById('x').value = (num1 -= movementAmount);
                break;
            case 'r':
                let num2 = parseFloat(document.getElementById('rotx').value);
                document.getElementById('rotx').value = (num2 -= movementAmount);
                break;
            case 's':
                let num3 = parseFloat(document.getElementById('scalex').value);
                document.getElementById('scalex').value = (num3 -= movementAmount);
                break;
        }
    }
}

// Camera

function InputFromCamera()
{
    /*
    document.getElementById('camerax').value = Camera.position.x;
    document.getElementById('cameray').value = Camera.position.y;
    document.getElementById('cameraz').value = Camera.position.z;
    document.getElementById('camrotx').value = Camera.target.x;
    document.getElementById('camroty').value = Camera.target.y;
    document.getElementById('camrotz').value = Camera.target.z;
    setTimeout(() => 
    {
        UpdateToCamera();
    }, 800)
    */
}
function UpdateToCamera()
{       
   /* Camera.position.x = RetrieveNumber('camerax');
    Camera.position.y = document.getElementById('cameray').value;
    Camera.position.x = document.getElementById('cameraz').value;
    //Camera.target.x = document.getElementById('camrotx').value;
    //Camera.target.y = document.getElementById('camroty').value;
    //Camera.target.z = document.getElementById('camrotz').value;
    setTimeout(() => 
    {
        requestAnimationFrame(UpdateToCamera);
    }, 500)
    */
}

// System Functions
function RetrieveNumber(element)
{
    return parseInt(document.getElementById(element).value);
}
function RetrieveValue(element)
{
    return document.getElementById(element).value;
}

// Append an object to be the child of a shell component
let AIV_ARRAY = [];
document.getElementById('ADD_SELECTED_OBJECT').onclick = () => 
{
    let component = ALL_OBJECTS[document.getElementById('AIV').value - 1];
    const nem = document.createElement('div');
    nem.style.height = '20px';  
    nem.style.width = '100%';
    nem.style.border = '0.5px solid white';
    nem.innerHTML = component.name;
    nem.style.color = 'red';
    AIV_ARRAY.push(component);
    nem.id = AIV_ARRAY.length;
    document.getElementById('selectedObjects').appendChild(nem);
    // button
    const remove = document.createElement('button');
    remove.style.backgroundColor = 'rgb(50, 50, 50)';
    remove.style.color = 'red';
    remove.innerHTML = 'x';
    remove.style.border = 'none';
    remove.style.float = 'right';
    remove.style.marginRight = '10px';
    // Events
    remove.onmouseover = () => 
    {
        remove.style.cursor = 'pointer';
    }
    remove.onclick = () => 
    {
        let index = nem.id;
        AIV_ARRAY.splice(index - 1, 1);
        nem.parentNode.removeChild(nem);
        document.getElementById('23-423434-234-4').innerHTML = "Array Length: " + AIV_ARRAY.length;
    }
    nem.appendChild(remove);
    document.getElementById('23-423434-234-4').innerHTML = "Array Length: " + AIV_ARRAY.length;
}
// append all of AIV_ARRAY to the currently selected Shell
document.getElementById('selectObject').onclick = () => 
{                                                       
    let data = [];
    for(let i = 0; i < AIV_ARRAY.length; i++)
    {
        data.push(...AIV_ARRAY[i].data);
        AIV_ARRAY[i].data = [];
    }
    let currentComponent = ALL_OBJECTS[document.getElementById('selected_class').value - 1];
    currentComponent.data = data;
    document.getElementById('INSPECTOR_VIEW').style.display = 'none';
}
// append all of AIV_ARRAY as fixed to the selected Shell
document.getElementById('selectObject2').onclick = () => 
{
    let currentComponent = ALL_OBJECTS[document.getElementById('selected_class').value - 1];
    for(let i = 0; i < AIV_ARRAY.length; i++)
    {
        currentComponent.children.push(AIV_ARRAY[i]);

    }
    document.getElementById('INSPECTOR_VIEW').style.display = 'none';
}
// Prefabs
let prefabsComponent;
document.getElementById('prefabs_use').onclick = () => 
{
    let component = null;
    let name = document.getElementById('prefabs_name').value;
    for(let i = 0; i < ALL_OBJECTS.length; i++)
    {
        if(ALL_OBJECTS[i].name == name)
        {
            component = ALL_OBJECTS[i];
            break;
        }
    }
    if(component == null)
    {
        document.getElementById('prefabs_tools').style.display = 'none';
        document.getElementById('prefabs_error').style.display = 'block';
        setTimeout(() => 
        {
            document.getElementById('prefabs_error').style.display = 'none';
        }, 2500)
    } else 
    {
        document.getElementById('prefabs_tools').style.display = 'block';
        prefabsComponent = component;
    }
}
// Load saved prefabs

document.getElementById('loadPrefabs').onclick = () => 
{
    let retrieved = localStorage.getItem('_Prefabs');
    if(retrieved == null) return;

    let deserialized = JSON.parse(retrieved);
    for(let i = 0; i < deserialized.length; i++)
    {
        const box = document.createElement('div');
        box.style.height = '100px';
        box.style.width = '80px';
        box.style.backgroundColor = 'rgb(30, 30, 30)';
        box.style.color = 'lime';
        box.style.fontFamily = 'monospace';
        box.innerHTML = deserialized[i].name;
        box.style.borderRadius = '10px';
        box.style.boxShadow = '1px 1px 1px gray';
        box.style.fontSize = '10px';
        box.style.textAlign = 'center';
        box.style.margin = '5px';
        box.style.cursor = 'default';
        const remove = document.createElement('button');
        remove.style.backgroundColor = 'rgb(30, 30, 30)';
        remove.style.color = 'white';
        remove.style.fontFamily = 'monospace';
        remove.innerHTML = 'Destroy';
        remove.style.marginTop = '60px';   
        remove.style.borderRadius = '10px'; 
        remove.style.cursor = 'pointer';
        remove.onclick = () =>  
        {
            ALL_PREFABS.splice(deserialized[i], 1);
            if(ALL_PREFABS.length != 0)
            {
                localStorage.setItem('_Prefabs', ALL_PREFABS);
            }
            box.style.display = 'none';
        }
        box.ondblclick = () => 
        {
            const shell = new Shell();
            shell.name = deserialized[i].name;
            shell.position = deserialized[i].position;
            shell.rotation = deserialized[i].rotation;
            shell.scale = deserialized[i].scale;
            shell.material = deserialized[i].material;
            shell.data = deserialized[i].data;
            Cladd.Add(shell, EDITOR_BUFFER);
            Cladd.Add(shell, ALL_OBJECTS);
            AddToSystem(shell);
            document.getElementById('prefabsWindow').style.display = 'none';
        }
        box.appendChild(remove);
        document.getElementById('prefabLoadBox').appendChild(box);
    }
}

/*

*/
// Save prefab

document.getElementById('prefabs_save').onclick = () => 
{
    const prefab = new Prefab();
    prefab.name = document.getElementById('prefabs_newName').value;
    prefab.material = prefabsComponent.material;    
    prefab.position = prefabsComponent.position;
    prefab.rotation = prefabsComponent.rotation;
    prefab.scale = prefabsComponent.scale;
    prefab.data = prefabsComponent.data;
    prefab.drawMode = document.getElementById('prefabs_dm').value;
    // Set up for save
    ALL_PREFABS.push(prefab);
    localStorage.setItem('_Prefabs', JSON.stringify(ALL_PREFABS));
    // Clean up
    document.getElementById('prefabs_tools').style.display = 'none';
}
