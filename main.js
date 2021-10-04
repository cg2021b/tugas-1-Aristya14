// Aristya Vika Wijaya
// 0511194000233
// Grafkom B
var vertexShaderText = `
    precision mediump float;

    attribute vec2 a_Position;
    attribute vec3 a_Color;
    varying vec3 fragColor;
    
    uniform mat4 uTranslate;

    void main() {
        fragColor = a_Color;
        gl_Position = uTranslate * vec4(a_Position, 0.0, 1);
    }
`;

var fragmentShaderText = `
    precision mediump float;
    
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1);
    }
`;

function main() {
    //  Inisialisasi
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    //membuat vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    // membuat fragmen shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    //package program --> compile
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    // only do this for debungging purpose only
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    // membuat dari bebrapa bangun segitiga
    //untuk visualisasi gambar sebelah kiri
    var triangleVerticesLeft = 
    [ // koordinat x, koordinat y      R, G, B
       // si putih
        -0.17, 0.2,   1, 1, 1,
        -0.78, 0.2,   1, 1, 1,
        -0.8, -0.2,   1, 1, 1,

        //si putih
        -0.15, -0.2,   1, 1, 1,
        -0.8, -0.2,   1, 1, 1,
        -0.17, 0.2,    1, 1, 1,
            
        // si biru
        -0.26, 0.2,  0, 0, 0.6,
        -0.49, 0.2, 0, 0, 0.6,
        -0.5, -0.2,  0, 0, 0.6,

        //si biru
        -0.25, -0.2, 0, 0, 0.6,
        -0.5, -0.2, 0, 0, 0.6,
        -0.26, 0.2, 0, 0, 0.6,

        //angka tujuh bagian atas 1
        -0.27, 0.18, 1, 1, 1,
        -0.29, 0.09, 1, 1, 1,
        -0.27, 0.07, 1, 1, 1,
        //angka tujuh bagian atas 2
        -0.29, 0.19, 1, 1, 1,
        -0.29, 0.09, 1, 1, 1,
        -0.27, 0.17, 1, 1, 1,

        //angka 7 bagian miring 1
        -0.29, 0.09, 1, 1, 1,
        -0.29, 0.11, 1, 1, 1,
        -0.38, 0.17, 1, 1, 1,

        //angka 7 bagian miring 2
        -0.29, 0.09, 1, 1, 1,
        -0.38, 0.15, 1, 1, 1,
        -0.38, 0.17, 1, 1, 1,
  
        // isi buku
        -0.15, -0.2,   211/255, 183/255, 153/255,
        -0.8, -0.2, 211/255, 183/255, 153/255,
        -0.78, -0.23, 211/255, 183/255, 153/255,

        //isi buku
        -0.15, -0.2, 211/255, 183/255, 153/255,
        -0.17, -0.23, 211/255, 183/255, 153/255,
        -0.8, -0.23, 211/255, 183/255, 153/255,
    ];

    // untuk visualisasi gambar bergerak sebelah kanan
    var triangleVerticesRight = 
    [
        // si putih
         0.3, 0.23, 1, 1, 1,
         0.7, 0.23, 1, 1, 1,
         0.75, -0.2,   1, 1, 1,
        
        //si putih
         0.25, -0.2,     1, 1, 1,
         0.75, -0.2,     1, 1, 1,
         0.3, 0.23,      1, 1, 1,
            
         // si biru
        0.295, 0.18, 0, 0, 0.6,
        0.707, 0.18, 0, 0, 0.6,
        0.722, 0.04, 0, 0, 0.6,

        //si biru
         0.295, 0.18, 0, 0, 0.6,
         0.722, 0.04, 0, 0, 0.6,
        0.275, 0.04, 0, 0, 0.6,

        //angka tujuh bagian atas 1
        0.34, 0.17, 1, 1, 1,
        0.41, 0.16, 1, 1, 1,
        0.32, 0.16, 1, 1, 1,
        
        //angka tujuh bagian atas 1
        0.34, 0.17, 1, 1, 1,
        0.43, 0.17, 1, 1, 1,
        0.41, 0.16, 1, 1, 1,
        
        //angka tujuh bagian bawah 1
        0.41, 0.16, 1, 1, 1,
        0.39, 0.16, 1, 1, 1,
        0.35, 0.1,   1, 1, 1,
        //angka tujuh bagian bawah 1
        0.41, 0.16, 1, 1, 1,
        0.37, 0.1, 1, 1, 1,
        0.35, 0.1, 1, 1, 1,
        
        // isi buku
        0.25, -0.2, 211/255, 183/255, 153/255,
        0.75, -0.2, 211/255, 183/255, 153/255,
        0.73, -0.23, 211/255, 183/255, 153/255,

        0.25, -0.2, 211/255, 183/255, 153/255,
        0.28, -0.23, 211/255, 183/255, 153/255,
        0.7, -0.23, 211/255, 183/255, 153/255,

    ];

    var triangleVertices = [...triangleVerticesLeft, ...triangleVerticesRight];
    var triangleVertexBufferObject = gl.createBuffer();
    
    //untuk menggambar titik dan warna berbeda
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
   
    var aPosition = gl.getAttribLocation(program, 'a_Position');
    var aColor = gl.getAttribLocation(program, 'a_Color'); 
    
    gl.vertexAttribPointer(
        aColor, // lokasi atribut
        3, // Nomor elemen
        gl.FLOAT, // tipe elemen
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // ukuran individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        aPosition, // lokasi atribut
        2, // nomor elemen
        gl.FLOAT, // tipe elemen
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // ukuran individual vertex
        0 // Offset from the beginning of a 
    );


    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);
    gl.viewport(0, 0, canvas.width, canvas.height)

    // main render loop
    const uTranslate = gl.getUniformLocation(program, 'uTranslate');
    // speed sesuai nrp 3 digit terakhir
    var speed = 0.0233;
    var dy = 0;

    function render() {
        // warna canvas
        gl.clearColor(0.1, 0.2, 0.6, 0.4);
        //clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (dy >= 0.8 || dy <= -0.8) {
            speed = -speed;
        }
		
        dy += speed;
        
        const Right = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, dy, 0.0, 1.0,
        ];

		const Left = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0,
		];

        gl.useProgram(program);

        gl.uniformMatrix4fv(uTranslate, false, Right);
        gl.drawArrays(gl.TRIANGLES, triangleVerticesLeft.length / 5, triangleVerticesRight.length / 5);

        gl.uniformMatrix4fv(uTranslate, false, Left);
        gl.drawArrays(gl.TRIANGLES, 0, triangleVerticesLeft.length/5);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render)
}
