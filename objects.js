class Shell
{
    constructor()
    {
        this.name;
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 1};
        this.material = [1.0, 1.0, 1.0];
        this.data = [];
        this.drawMode = gl.TRIANGLE_STRIP;
        this.children = [];
    }
    draw()
    {
        // Update children
        for(let i = 0; i < this.children.length; i++)
        {
            this.children[i].position.x = this.position.x + this.children[i].position.x;
            this.children[i].position.y = this.position.y + this.children[i].position.y;
            this.children[i].position.z = this.position.z + this.children[i].position.z;
            UpdateMaterial(this.children[i]);
            //UpdateMatrix(this.children[i]);
        }
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawArrays(this.drawMode, 0, this.data.length / 6);
    }
}
class Plane
{
    constructor()
    {
        this.name;
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 0};
        this.material = [1.0, 1.0, 1.0];
        this.data = 
        [
            this.position.x + this.scale.x / 2, this.position.y + this.scale.y / 2, 0, ...this.material,
            this.position.x - this.scale.x / 2, this.position.y + this.scale.y / 2, 0, ...this.material,
            this.position.x + this.scale.x / 2, this.position.y - this.scale.y / 2, 0, ...this.material,
            this.position.x - this.scale.x / 2, this.position.y - this.scale.y / 2, 0, ...this.material
        ];
    }
    draw()
    {
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.data.length / 6);
    }
}

class Triangle
{
    constructor()
    {
        this.name;
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 0};
        this.material = [1.0, 1.0, 1.0];
        this.data = 
        [
            -0.5, -0.5, 0.0, ...this.material,
            0.5, -0.5, 0.0, ...this.material,   
            0.0, 0.5, 0.0, ...this.material,    
        ];
    }
    draw()
    {
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, this.data.length / 6);
    }
}
class Circle
{
    constructor()
    {
        this.name;
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 0};
        this.material = [1.0, 1.0, 1.0];
        this.data = [];
        this.radius = 1;
        this.segments = 50;
        this.angleStep = (Math.PI * 2) / this.segments;
        for(let i = 0; i < this.segments; i++)
        {   
            let angle = i * this.angleStep;
            let x = this.radius * Math.cos(angle);
            let y = this.radius * Math.sin(angle);
            this.data.push(x, y, this.position.z, ...this.material);
        }
    }   
    draw()
    {   
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.data.length / 6);
    }
}
class HemiCircle
{
    constructor()
    {
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 0};
        this.material = [1.0, 1.0, 1.0];
        this.data = [];
        this.poly = 30;
        this.radius = 1;
        this.generate();
    }
    generate()
    {
        this.data = [];
        let angleStep = Math.PI / this.poly;
        for(let i = 0; i < this.poly; i++)
        {
            let angle = i * angleStep;
            let x = this.radius * Math.cos(angle);
            let y = this.radius * Math.sin(angle);
            let z = this.position.z;
            this.data.push(x, y, z, ...this.material);
        }
    }
    draw()
    {
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.data.length / 6);
    }
}
class Sphere
{
    constructor()
    {
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 1};
        this.material = [1.0, 1.0, 1.0];
        this.lat = 50;
        this.long = 50;
        this.radius = 1;
        this.data = [];
        this.indices = [];
        
        for(let lat = 0; lat <= this.lat; lat++)
        {
            let theta = lat * Math.PI / this.lat;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for(let long = 0; long <= this.long; long++)
            {
                let phi = long * 2 * Math.PI / this.long;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                this.data.push(this.radius * x);
                this.data.push(this.radius * y);
                this.data.push(this.radius * z);
                this.data.push(...this.material);
            }
        }
        // Indices
        for(let lat = 0; lat < this.lat; lat++)
        {
            for(let long = 0; long < this.long; long++)
            {
                let first = (lat * (this.long + 1)) + long;
                let second = first + this.long + 1;
                
                this.indices.push(first);
                this.indices.push(second);
                this.indices.push(first + 1);
                this.indices.push(second);
                this.indices.push(second + 1);
                this.indices.push(first + 1);
            }
        }
    }
    draw()
    {
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
class Box
{
    constructor()
    {
        this.name;  
        this.position = {x: 0, y: 0, z: 0}; 
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 0.5, y: 0.5, z: 0.5};
        this.material = [1.0, 1.0, 1.0];
        this.data = [
            -1.0, -1.0,  1.0, ...this.material,   1.0, -1.0,  1.0, ...this.material,   1.0,  1.0,  1.0, ...this.material,  -1.0,  1.0,  1.0, ...this.material,  // Front face
            -1.0, -1.0, -1.0, ...this.material,  -1.0,  1.0, -1.0, ...this.material,   1.0,  1.0, -1.0, ...this.material,   1.0, -1.0, -1.0, ...this.material,  // Back face
            -1.0,  1.0, -1.0, ...this.material,  -1.0,  1.0,  1.0, ...this.material,   1.0,  1.0,  1.0, ...this.material,   1.0,  1.0, -1.0, ...this.material,  // Top face
            -1.0, -1.0, -1.0, ...this.material,   1.0, -1.0, -1.0, ...this.material,   1.0, -1.0,  1.0, ...this.material,  -1.0, -1.0,  1.0, ...this.material,  // Bottom face
             1.0, -1.0, -1.0, ...this.material,   1.0,  1.0, -1.0, ...this.material,  1.0,  1.0,  1.0, ...this.material,   1.0, -1.0,  1.0, ...this.material,  // Right face
            -1.0, -1.0, -1.0,  ...this.material, -1.0, -1.0,  1.0, ...this.material,  -1.0,  1.0,  1.0, ...this.material,  -1.0,  1.0, -1.0, ...this.material,   // Left face
        ];   
    }
    draw()
    {
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.data.length / 6);
    }
    
}

// Physics
class Rigidbody
{
    constructor()
    {
        this.parent = null;
        this.mass = 1;
        this.drag = 0.01;
        this.rotationDrag = 0.003;
        this.acceleration = 0.003;
        this.velocity = {x: 0, y: 0, z: 0};
        this.rv = {x: 0, y: 0, z: 0};
    }
    attach(component)
    {
        this.parent = component;
    }
    update()
    {
        if(this.parent != null)
        {
            // Rotation drag
            this.rv.x -= this.rotationDrag * this.rv.x;
            this.rv.y -= this.rotationDrag * this.rv.y;
            this.rv.z -= this.rotationDrag * this.rv.z;
            // Velocity / gravity
            this.velocity.y -= this.acceleration;
            // Apply Quaternion
            this.parent.rotation = this.rv;
            // Apply position vector
            this.parent.position.x += this.velocity.x;
            this.parent.position.y += this.velocity.y;
            this.parent.position.z += this.velocity.z;
        }
    }
}

// Rendering and other tools
class Terrain
{
    constructor()
    {
        this.name;
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 100, y: 100, z: 0};
        this.material = [1.0, 1.0, 1.0];
        this.resolution = 50;
        this.data = [];
        this.indices = [];
        this.generateData();
    }
    generateData()
    {
        this.data = [];
        for (var i = 0; i < this.resolution; i++) {
            for (var j = 0; j < this.resolution; j++) {
                var x = (i / (this.resolution - 1)) * this.scale.x - (this.scale.x / 2);
                var z = (j / (this.resolution - 1)) * this.scale.y - (this.scale.x / 2);
                var y = 0; // Flat terrain (you can modify this to add height)
        
                this.data.push(x, y, z, ...this.material);
        
                // Define indices for triangles
                if (i < this.resolution - 1 && j < this.resolution - 1) {
                    var currentIndex = i * this.resolution + j;
                    var nextIndex = currentIndex + this.resolution;
        
                    // Define two triangles for each grid cell
                    this.indices.push(currentIndex, currentIndex + 1, nextIndex);
                    this.indices.push(nextIndex, currentIndex + 1, nextIndex + 1);
                }
            }
        }
    }
    randomizeZ(min, max)
    {
        for(let i = 0; i < this.data.length; i += 6)
        {
            this.data[i + 1] = Math.random(min) * max;
        }
    }
    draw()  
    {
        let modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [this.position.x, this.position.y, this.position.z]);
        mat4.rotateX(modelMatrix, modelMatrix, this.rotation.x);
        mat4.rotateY(modelMatrix, modelMatrix, this.rotation.y);
        mat4.rotateZ(modelMatrix, modelMatrix, this.rotation.z);
        gl.uniformMatrix4fv(mWorldLoc, false, modelMatrix);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}

// Tools
class CustomGeometry
{
    constructor()
    {
        this.name;
        this.active = true;
        this.drawType = '1';
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 1};
        this.material = [1.0, 1.0, 1.0];
        this.cursor = {x: 0, y: 0, z: 0};
        this.movement = 1;
        this.previusPosition = {x: this.cursor.x, y: this.cursor.y - 1, z: this.cursor.z};
        this.data = [
            this.position.x, this.position.y, this.position.z, ...this.material,
            this.position.x, this.position.y, this.position.z, ...this.material,
        ];
        // Controls
        window.addEventListener('keydown', e => {
            if(!this.active) return;
            switch(e.key)
            {
                case 'w':
                    this.cursor.y += this.movement;
                    break;
                case 's':
                    this.cursor.y -= this.movement;
                    break;
                case 'd':
                    this.cursor.x -= this.movement;
                    break;
                case 'a':
                    this.cursor.x += this.movement;
                    break;
                case 'c':
                    this.cursor.z += this.movement;
                    break;
                case 'v':
                    this.cursor.z -= this.movement;
                    break;
                case "W":
                    this.previusPosition.y += this.movement;
                    break;
                case "S":
                    this.previusPosition.y -= this.movement;
                    break;
                case "D":
                    this.previusPosition.x -= this.movement;
                    break;
                case 'A':
                    this.previusPosition.x += this.movement;
                    break;
                case 'e':
                    this.addVertex();
                    break;
                case '1':
                    this.drawType = '1';
                    break;
                case '2':   
                    this.drawType = '2';
                    break;
                case '3':
                    this.drawType = '3';
                    break;
                case '4':
                    this.drawType = '4';
                    break;
                case 'r':
                    this.previusPosition = {x: 0, y: 0, z: 0};
                    break;
                case 'z':
                    this.data.splice(this.data.length - 12);
                    break;
                case 'g':
                    const shell = new Shell();
                    shell.data = this.data;
                    shell.position.x = this.position.x;
                    shell.position.y = this.position.y
                    if(this.drawType == '1') shell.drawMode = gl.LINES;
                    if(this.drawType == '2') shell.drawMode = gl.TRIANGLE_STRIP;
                    if(this.drawType == '3') shell.drawMode = gl.TRIANGLE_FAN;
                    if(this.drawType == '4') shell.drawMode = gl.TRIANGLES;
                    Cladd.Add(shell, EDITOR_BUFFER);    
                    Cladd.Add(shell, ALL_OBJECTS);
                    shell.name = 'ShellCopy - GA ' + ALL_OBJECTS.length;
                    AddToSystem(shell);
                    break;  
            }
        })
        
    }
    addVertex()
    {
        this.data.push(this.cursor.x, this.cursor.y, this.cursor.z, ...this.material);
        this.data.push(this.previusPosition.x, this.previusPosition.y, this.previusPosition.z, ...this.material);
        this.previusPosition.x = this.cursor.x;
        this.previusPosition.y = this.cursor.y;
        this.previusPosition.z = this.cursor.z; 
    }   
    draw()
    {
        UpdateMaterial(this);
        UpdateMatrix(this);
        if(this.active)
        {
            let temp = 
            [
                this.previusPosition.x, this.previusPosition.y, this.previusPosition.z, 1, 0, 0,
                this.cursor.x, this.cursor.y, this.cursor.z, 0, 1, 0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(temp), gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, temp.length / 6);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        switch(this.drawType)
        {
            case '1':
                gl.drawArrays(gl.LINES, 0, this.data.length / 6);
                break;
            case '2':
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.data.length / 6);
                break;
            case '3':
                gl.drawArrays(gl.TRIANGLE_FAN, 0, this.data.length / 6);
                break;
            case '4':
                gl.drawArrays(gl.TRIANGLES, 0, this.data.length / 6);
                break;
        }
    }
}

class Prefab
{
    constructor()
    {
        this.name;  
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 0};
        this.material = [1.0, 1.0, 1.0];
        this.data = [];
        this.drawMode = gl.LINES;
    }
    AppendRawVertexData(data)
    {
        this.data = data;
    }
    appendMaterialData(material)
    {
        this.material = material;
        let vtx = [];
        for(let i = 0; i < this.data; i+=6)
        {
            let x = this.data[i];
            let y = this.data[i+1];
            let z = this.data[i+2];
            vtx.push(x, y, z, ...this.material);
        }
        this.data = [];
        this.data = vtx;
    }
    draw()
    {
        UpdateMaterial(this);
        UpdateMatrix(this);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        gl.drawArrays(this.drawMode, 0, this.data.length / 6);
    }
}
// Transform attributes
class Vector3
{
    constructor(position)
    {
        this.x = position.x;
        this.y = position.y;
        this.z = position.z;
    }
}
// Matrix
function UpdateMatrix(object)
{
    let modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [object.position.x, object.position.y, object.position.z]);
    mat4.rotateX(modelMatrix, modelMatrix, object.rotation.x);
    mat4.rotateY(modelMatrix, modelMatrix, object.rotation.y);
    mat4.rotateZ(modelMatrix, modelMatrix, object.rotation.z);
    mat4.scale(modelMatrix, modelMatrix, [object.scale.x, object.scale.y, object.scale.z]);
    gl.uniformMatrix4fv(mWorldLoc, false, modelMatrix);
}
function UpdateMaterial(object)
{
    let newData = [];
    for(let i = 0; i < object.data.length; i += 6)
    {
        let x = object.data[i];
        let y = object.data[i+1];   
        let z = object.data[i+2];
        newData.push(x, y, z, ...object.material);  
    }
    object.data = [];
    object.data = newData;
}
function GenerateMaterial()
{
    let newMaterial = [];
    newMaterial.push(Math.random() * 1);
    newMaterial.push(Math.random() * 1);
    newMaterial.push(Math.random() * 1);
    return newMaterial;
}

