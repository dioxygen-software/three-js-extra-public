import { BufferAttribute, InterleavedBufferAttribute, GLBufferAttribute } from 'three';

/**
 * Add "baricentric coordinates", with actually means uv per triangle.
 * Those are used as vaying in shaders to know where we are exactly on the currently rendered triangle.
 * It is used, for example, to create nice and smooth wirframe render.
 * @param {import('three').BufferGeometry} geometry
 */
function computeVertexBarycentricCoordinates(geometry) {
    if (geometry.getIndex() !== null) {
        throw "Error : cannot add barycentric coordinates on indexed geometry. Please call toNonIndexed first.";
    }

    const nVertices = geometry.getAttribute("position")?.count;

    let bar = geometry.getAttribute("barycentric");
    if (bar === undefined) {
        geometry.addAttribute("barycentric", new Float32Array(nVertices * 3), 3);
    }
    bar = geometry.getAttribute("barycentric");

    if (!(bar instanceof BufferAttribute)) {
        throw "Error: cannot compute barycentric coordinates as the barycentric attribute is not a BufferAttribute. Other types are not supported (yet).";
    }

    // In this case we build the content of barycenter coordinates
    const kn = bar.count;
    for (let k = 0; k < kn; k += 3) {
        bar.setXYZ(k, 1, 0, 0);
        bar.setXYZ(k + 1, 0, 1, 0);
        bar.setXYZ(k + 2, 0, 0, 1);
    }

    return geometry;
}

export {
    computeVertexBarycentricCoordinates
}