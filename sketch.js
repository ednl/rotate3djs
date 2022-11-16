// Frame rate, rotation step (degrees), viewer distance
const f = 60;
const a = 1;

// Cube points p0(x,y,z) and next time step p1(x',y',z')
const p = [[
    [-1,-1,-1], [ 1,-1,-1], [ 1, 1,-1], [-1, 1,-1],
    [-1,-1, 1], [ 1,-1, 1], [ 1, 1, 1], [-1, 1, 1]
],[
    [0,0,0], [0,0,0], [0,0,0], [0,0,0],
    [0,0,0], [0,0,0], [0,0,0], [0,0,0]
]];

// Projected points
const q = [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]];

// Number of points
const N = q.length;

// Cube edges (pi->pj)
const e = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
];

// Time step 0 or 1
let t = 0;

// Rotation matrices
let R;

// Rotation around axis r (0=x, 1=y, 2=z)
function rot3d(r) {
    const u = 1 - t;                    // prepare next time step (swap 0<->1)
    for (let i = 0; i < N; ++i) {       // N points
        for (let j = 0; j < 3; ++j) {   // 3 dimensions
            // Product of matrix R and vector p: p' = R.p
            p[u][i][j] = R[r][j][0] * p[t][i][0] + R[r][j][1] * p[t][i][1] + R[r][j][2] * p[t][i][2];
        }
    }
    t = u;  // go to next time step (swap 0<->1)
}

// Projection from distance d
function proj2d(d) {
    for (let i = 0; i < N; ++i) {         // N points
        const z = 1 / (d - p[t][i][2]);
        const T = [[z,0,0], [0,z,0]];     // projection matrix 2x3
        for (let j = 0; j < 2; ++j) {     // 2 dimensions
            // Product of matrix T and vector p: q = T.p
            q[i][j] = T[j][0] * p[t][i][0] + T[j][1] * p[t][i][1] + T[j][2] * p[t][i][2];
        }
    }
}

// Draw cube edges
function render() {
    const x0 = width / 2;   // centre X
    const y0 = height / 2;  // centre Y
    const sx = width;       // scale X
    const sy = sx;          // scale Y
    for (const v of e) {    // every pair of cube points (vertices)
        const i = v[0];
        const j = v[1];
        line(x0 + sx * q[i][0], y0 + sy * q[i][1], x0 + sx * q[j][0], y0 + sy * q[j][1]);
    }
}

function setup() {
    frameRate(f);
    createCanvas(400, 400);
    stroke(0, 102, 0);
    strokeWeight(3);

    angleMode(DEGREES);
    const c = cos(a);
    const s = sin(a);
    R = [[
        [ 1,  0,  0 ],
        [ 0,  c, -s ],
        [ 0,  s,  c ]
    ],[
        [ c,  0, -s ],
        [ 0,  1,  0 ],
        [ s,  0,  c ]
    ],[
        [ c, -s,  0 ],
        [ s,  c,  0 ],
        [ 0,  0,  1 ]
    ]];

    proj2d(2);
}

function draw() {
    background(51);
    render();
    if (document.getElementById("x").checked) {
        rot3d(0);
    }
    if (document.getElementById("y").checked) {
        rot3d(1);
    }
    if (document.getElementById("z").checked) {
        rot3d(2);
    }
    const d = parseFloat(document.getElementById("d").value);
    proj2d(d);
}
