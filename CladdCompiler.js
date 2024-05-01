let Keys = 
{
    triangle:'Triangle',
    plane:'Plane',
    circle:'Circle',
    AddComp:'Cladd_ADD',
    position:'SetPosition',
    rotation:'SetRotation',
    attrib:'Attrib',
    arrayAttrib:'ArrayAttrib',
    findObject:'FindComponentByName',
    str:'string',
    int:'int',
    vector3:'Vetor3',
    camera:'Camera',
    voidmain:'Method.Main',
    add:'Add',
    subtract:'Sub'
}
let KW_Variables = 
[
    'Triangle()','Plane();','Circle()'
];
let CONVERTED_DATA = [];
let comp = [];
function ConvertFile()
{
    const textarea = document.getElementById('CSEW_CONT');
    const textareaContent = textarea.value.trim();
    // Split the content into words using a regular expression
    const words = textareaContent.split(/\b[^\w.]+\b/);
    // Remove any empty strings from the array
    const filteredWords = words.filter(word => word.trim() !== '');
    CONVERTED_DATA.push(filteredWords);
    Interperet(filteredWords);
}
// Compilation process
function Interperet(data)
{
    comp = [];
    for(let i = 0; i < data.length; i++)
    {
        if(data[i] == Keys.triangle)            
        {
            let newTerm = 'const ' + data[i - 1] + ' = new  ' + 'Triangle();\n'; 
            comp.push(newTerm); 
        }
        if(data[i] == Keys.plane){let term = 'const ' + data[i-1]+' = new Plane();\n'; comp.push(term);}
        if(data[i] == Keys.circle){let term = 'const ' + data[i-1] + ' = new Circle();\n'; comp.push(term);}
        if(data[i] == Keys.AddComp){comp.push('Cladd.Add(' + data[i+1] + ', MAIN_BUFFER);\n')};
        if(data[i] == Keys.position){let term = "SetPosition(" + data[i-1]+ ', '+ data[i+1]+', '+data[i+2]+', '+data[i+3]+');\n'; comp.push(term);};
        if(data[i] == Keys.rotation){comp.push('SetRotation(' + data[i-1] + ', ' + data[i+1] + ',' + data[i+2] + ',' + data[i+3] + ');\n');}
        if(data[i] == Keys.attrib){comp.push(data[i-1]+'.'+data[i+1] + ' = ' + data[i+2] + ';')};
        if(data[i] == Keys.arrayAttrib){comp.push(data[i-1] +'.'+data[i+1]+'[' + data[i+2] + '] = ' + data[i+3] + '\n')};
        if(data[i] == Keys.findObject){comp.push('const ' + data[i-1] + ' = ' + FindObjectByName(data[i+1]) + ';\n')};
        if(data[i] == Keys.str){comp.push('let ' + data[i+1] + ' = ' + '"' + data[i+2] + '";\n')};
        if(data[i] == Keys.int){comp.push('let ' + data[i+1] + ' = ' + data[i+2] + ';\n')};
        if(data[i] == Keys.camera){comp.push('Camera.'+data[i+1] + ' = ' + data[i+2]+';\n')};
        if(data[i] == Keys.add){comp.push(data[i+1] + '+ ' + data[i+2] + ';')};
    }             
    LinkCompiledProgram(comp);  
}
function LinkCompiledProgram(data)
{
    let masterString = data.join('<br>');
    document.getElementById('compiledCladdScript_h').innerHTML = '';  
    document.getElementById('compiledCladdScript_h').innerHTML = masterString;
    document.getElementById('compiledCladdScript').style.display = 'block';
}

function Check(word, array)
{
    let found = false;
    for(let i = 0; i < array.length; i++)
    {
        if(array[i] == word) found = true;
    }
    return found;
}
// Compiler Specific methods

function FindObjectByName(name) 
{
    for(let i = 0; i < ALL_OBJECTS.length; i++)
    {
        if(ALL_OBJECTS[i].name == name) 
        {
            return ALL_OBJECTS[i];
        }
    }
    return null;
}