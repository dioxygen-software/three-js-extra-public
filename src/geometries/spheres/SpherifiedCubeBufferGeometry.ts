import { BufferGeometry, Vector3, BoxBufferGeometry, Float32BufferAttribute } from "three"

export class SpherifiedCubeBufferGeometry extends BufferGeometry {

    parameters: {
        radius: number;
        widthHeightSegments: number;
    }

    constructor(radius: number, widthHeightSegments: number) {
        super();

        this.type = "SpherifiedCubeBufferGeometry";

        radius = radius || 1;

        widthHeightSegments = widthHeightSegments || 8;

        this.parameters = {
            radius: radius,
            widthHeightSegments: widthHeightSegments,
        };

        // generate cube

        var vertex = new Vector3();
        var vertex2 = new Vector3();
        var normal = new Vector3();

        // buffers

        var indices = [];
        var vertices = [];
        var normals = [];
        var uvs = [];

        // we create a normal cube and buffer it in our geometry

        var cubeBufferGeometry = new BoxBufferGeometry(
            1,
            1,
            1,
            widthHeightSegments,
            widthHeightSegments,
            widthHeightSegments
        );

        let positionArray = cubeBufferGeometry.getAttribute("position").array;
        for (let i = 0; i < positionArray.length; ++i) {
            vertices.push(positionArray[i]);
        }

        let normalArray = cubeBufferGeometry.getAttribute("normal").array;
        for (let i = 0; i < normalArray.length; ++i) {
            normals.push(normalArray[i]);
        }

        let uvArray = cubeBufferGeometry.getAttribute("uv").array;
        for (let i = 0; i < uvArray.length; ++i) {
            uvs.push(uvArray[i]);
        }

        // CubeBufferGeometry shouldn't have a null index attribute. 
        if (cubeBufferGeometry.index === null) {
            throw "cubeBufferGeometry has null index attribute."
        }

        let indexArray = cubeBufferGeometry.index.array;
        for (let i = 0; i < indexArray.length; ++i) {
            indices.push(indexArray[i]);
        }

        // then normalizing the cube to have a sphere

        var vIndex;

        var verticesSphere = [];
        var normalsSphere = [];

        // generate vertices, normals and uvs

        for (vIndex = 0; vIndex < vertices.length; vIndex += 3) {
            vertex.x = vertices[vIndex] * 2.0;
            vertex.y = vertices[vIndex + 1] * 2.0;
            vertex.z = vertices[vIndex + 2] * 2.0;

            // normalize to have sphere vertex

            vertex2.x = vertex.x ** 2;
            vertex2.y = vertex.y ** 2;
            vertex2.z = vertex.z ** 2;

            vertex.x *=
                Math.sqrt(
                    1.0 -
                    0.5 * (vertex2.y + vertex2.z) +
                    (vertex2.y * vertex2.z) / 3.0
                ) * radius;
            vertex.y *=
                Math.sqrt(
                    1.0 -
                    0.5 * (vertex2.z + vertex2.x) +
                    (vertex2.z * vertex2.x) / 3.0
                ) * radius;
            vertex.z *=
                Math.sqrt(
                    1.0 -
                    0.5 * (vertex2.x + vertex2.y) +
                    (vertex2.x * vertex2.y) / 3.0
                ) * radius;

            verticesSphere.push(vertex.x, vertex.y, vertex.z);

            // normal

            normal.set(vertex.x, vertex.y, vertex.z).normalize();
            normalsSphere.push(normal.x, normal.y, normal.z);
        }

        // build geometry

        this.setIndex(indices);
        this.setAttribute(
            "position",
            new Float32BufferAttribute(verticesSphere, 3)
        );
        this.setAttribute(
            "normal",
            new Float32BufferAttribute(normalsSphere, 3)
        );
        this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    }
}