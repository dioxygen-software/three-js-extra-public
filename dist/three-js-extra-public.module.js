import { Ray, Vector3, Matrix4, BoxBufferGeometry, Box3, BufferAttribute, ShaderMaterial, UniformsUtils, ShaderLib, TangentSpaceNormalMap, Vector2, MeshDepthMaterial, RGBADepthPacking, BufferGeometry } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

Ray.prototype.intersectsConeFrustum = function () {
    const D = new Vector3();
    const target2 = new Vector3();
    const u = new Vector3();
    return function (frustum, target) {
        if (target == null)
            target = target2;
        const deltaR = frustum.radius1 - frustum.radius0;
        const r = 1 + Math.pow(deltaR / frustum.height, 2);
        const R = frustum.radius0 * deltaR / frustum.height;
        D.subVectors(this.origin, frustum.base);
        const DdA = D.dot(frustum.axis);
        const DdD = D.dot(D);
        const VdA = this.direction.dot(frustum.axis);
        const VdD = this.direction.dot(D);
        const VdV = this.direction.dot(this.direction);
        const c0 = frustum.radius0 * frustum.radius0 + 2 * R * DdA + r * DdA * DdA - DdD;
        const c1 = R * VdA + r * DdA * VdA - VdD;
        const c2 = r * VdA * VdA - VdV;
        if (c2 !== 0) {
            const discr = c1 * c1 - c2 * c0;
            if (discr < 0)
                return null;
            else if (discr === 0) {
                const t = -c1 / c2;
                u.copy(D);
                u.addScaledVector(this.direction, t);
                const d = frustum.axis.dot(u);
                if (t >= 0 && d >= 0 && d <= frustum.height) {
                    target2.addVectors(frustum.base, u);
                    target.copy(target2);
                    return target2;
                }
            }
            else {
                let quantity = 0;
                const root = Math.sqrt(discr);
                const t0 = (-c1 - root) / c2;
                u.copy(D);
                u.addScaledVector(this.direction, t0);
                let d = frustum.axis.dot(u);
                if (t0 >= 0 && d >= 0 && d <= frustum.height) {
                    target2.addVectors(frustum.base, u);
                    quantity++;
                }
                const t1 = (-c1 + root) / c2;
                u.copy(D);
                u.addScaledVector(this.direction, t1);
                d = frustum.axis.dot(u);
                if (t1 >= 0 && (quantity === 0 || t0 > t1) && d >= 0 && d <= frustum.height) {
                    target2.addVectors(frustum.base, u);
                    quantity++;
                }
                if (quantity)
                    target.copy(target2);
                return quantity ? target2 : null;
            }
        }
        else if (c1 !== 0) {
            const t = -2 * c0 / c1;
            u.copy(D);
            u.addScaledVector(this.direction, t);
            const d = frustum.axis.dot(u);
            if (t >= 0 && d >= 0 && d <= frustum.height) {
                target2.addVectors(frustum.base, u);
                target.copy(target2);
                return target;
            }
        }
        return null;
    };
}();

const tmpVec = new Vector3(); new Vector3(); const tmpVec2 = new Vector3(); new Vector3();
const tmpMat = new Matrix4();
const baseCubePositions = new BoxBufferGeometry(2, 2, 2).toNonIndexed().attributes.position;
/**
 * @author Max Godefroy <max@godefroy.net>
 */
class ConeFrustum {
    /**
     * @param base      {?Vector3}
     * @param axis      {?Vector3}
     * @param height    {?number}
     * @param radius0   {?number}
     * @param radius1   {?number}
     */
    constructor(base, axis, height, radius0, radius1) {
        this.base = base || new Vector3();
        this.axis = axis || new Vector3(0, 1, 0);
        this.axis.normalize();
        this.height = height || 1;
        this.radius0 = radius0 || 0;
        this.radius1 = radius1 || 0;
    }
    /**
     * @param center0   {!Vector3}
     * @param radius0   {number}
     * @param center1   {!Vector3}
     * @param radius1   {number}
     * @returns {ConeFrustum}
     */
    static fromCapsule(center0, radius0, center1, radius1) {
        if (radius0 > radius1)
            return this.fromCapsule(center1, radius1, center0, radius0);
        const axis = new Vector3().subVectors(center1, center0);
        if (axis.length() === 0)
            throw "Capsule height must not be zero";
        const sinTheta = (radius1 - radius0) / axis.length();
        const height = axis.length() + sinTheta * (radius0 - radius1);
        const base = new Vector3().copy(center0).addScaledVector(axis.normalize(), -sinTheta * radius0);
        const cosTheta = Math.cos(Math.asin(sinTheta));
        return new ConeFrustum(base, axis, height, radius0 * cosTheta, radius1 * cosTheta);
    }
    /**
     *  Project the given point on the axis, in a direction orthogonal to the cone frustum surface.
     **/
    orthogonalProject(p, target) {
        // We will work in 2D, in the orthogonal basis x = this.axis and y = orthogonal vector to this.axis in the plane (this.basis, p, this.basis + this.axis),
        // and such that p has positive y coordinate in this basis.
        // The wanted projection is the point at the intersection of:
        //  - the local X axis (computation in the unit_dir basis)
        //  and
        //  - the line defined by P and the vector orthogonal to the weight line
        const baseToP = tmpVec;
        baseToP.subVectors(p, this.base);
        const baseToPlsq = baseToP.lengthSq();
        const p2Dx = baseToP.dot(this.axis);
        // pythagore inc.
        const p2DySq = baseToPlsq - p2Dx * p2Dx;
        const p2Dy = p2DySq > 0 ? Math.sqrt(p2DySq) : 0; // because of rounded errors tmp can be <0 and this causes the next sqrt to return NaN...
        const t = p2Dx - p2Dy * (this.radius0 - this.radius1) / this.height;
        target.copy(this.axis).multiplyScalar(t).add(this.base);
    }
    /**
     * @param frustum   {!ConeFrustum}
     */
    copy(frustum) {
        this.base = frustum.base.clone();
        this.axis = frustum.axis.clone();
        this.height = frustum.height;
        this.radius0 = frustum.radius0;
        this.radius1 = frustum.radius1;
    }
    clone() {
        return new ConeFrustum().copy(this);
    }
    empty() {
        return this.height === 0 || (this.radius0 === 0 && this.radius1 === 0);
    }
    /**
     * @param target    {?Box3}
     * @returns {!Box3}
     */
    getBoundingBox(target) {
        const c = this.base.clone();
        const d = new Vector3();
        d.set(Math.sqrt(1.0 - this.axis.x * this.axis.x), Math.sqrt(1.0 - this.axis.y * this.axis.y), Math.sqrt(1.0 - this.axis.z * this.axis.z));
        d.multiplyScalar(this.radius0);
        const box1 = new Box3(new Vector3().subVectors(c, d), new Vector3().addVectors(c, d));
        d.divideScalar(this.radius0);
        d.multiplyScalar(this.radius1);
        c.addScaledVector(this.axis, this.height);
        const box2 = new Box3(new Vector3().subVectors(c, d), new Vector3().addVectors(c, d));
        box1.union(box2);
        if (target != null)
            target.copy(box1);
        return box1;
    }
    /**
     * @deprecated Use `ConeFrustum.computeOptimisedDownscalingBoundingCube` instead
     *
     * @param {!Vector3} origin		The origin for the current coordinate space
     *
     * @returns {Float32Array} 		The cube position vertex coordinates as a flat array
     */
    computeOptimisedBoundingCube(origin) {
        const attribute = baseCubePositions.clone();
        const r = Math.max(this.radius0, this.radius1);
        tmpMat.makeScale(r, this.height / 2, r);
        attribute.applyMatrix4(tmpMat);
        tmpVec.set(0, 1, 0);
        const angle = tmpVec.angleTo(this.axis);
        tmpVec.cross(this.axis).normalize();
        if (tmpVec.length() > 0) {
            tmpMat.makeRotationAxis(tmpVec, angle);
            attribute.applyMatrix4(tmpMat);
        }
        tmpVec.copy(this.base).addScaledVector(this.axis, this.height / 2).sub(origin);
        tmpMat.makeTranslation(tmpVec.x, tmpVec.y, tmpVec.z);
        attribute.applyMatrix4(tmpMat);
        return attribute.array;
    }
    /**
     * @param {!Vector3} center0
     * @param {!number} radius0
     * @param {!Vector3} center1
     * @param {!number} radius1
     * @param {?Vector3} origin		The origin for the current coordinate space. Can be null.
     * @param {?number} minScale
     *
     * @returns {Float32Array} 		The cube position vertex coordinates as a flat array
     */
    static computeOptimisedDownscalingBoundingCube(center0, radius0, center1, radius1, origin, minScale) {
        if (radius0 > radius1)
            return this.computeOptimisedDownscalingBoundingCube(center1, radius1, center0, radius0, origin, minScale);
        const facePositionsArray = new Float32Array([
            // Smaller face
            -1, -1, -1,
            1, -1, -1,
            -1, -1, 1,
            1, -1, 1,
            // Intermediate face
            -1, 1, -1,
            1, 1, -1,
            -1, 1, 1,
            1, 1, 1,
            // Bigger face
            -1, 1, -1,
            1, 1, -1,
            -1, 1, 1,
            1, 1, 1,
        ]);
        const indexes = [
            // Small face
            0, 1, 3, 0, 3, 2,
            // Small to intermediate faces
            6, 4, 0, 6, 0, 2,
            7, 6, 2, 7, 2, 3,
            5, 7, 3, 5, 3, 1,
            4, 5, 1, 4, 1, 0,
            // Intermediate to big faces
            10, 8, 4, 10, 4, 6,
            11, 10, 6, 11, 6, 7,
            9, 11, 7, 9, 7, 5,
            8, 9, 5, 8, 5, 4,
            // Big face
            9, 8, 10, 9, 10, 11,
        ];
        const toPositions = function () {
            const positions = new Float32Array(indexes.length * 3);
            for (let i = 0; i < indexes.length; i++) {
                const p = indexes[i] * 3;
                positions[3 * i] = facePositionsArray[p];
                positions[3 * i + 1] = facePositionsArray[p + 1];
                positions[3 * i + 2] = facePositionsArray[p + 2];
            }
            return positions;
        };
        const tmpVec1 = new Vector3().subVectors(center1, center0);
        if (tmpVec1.length() === 0)
            throw "Capsule height must not be zero";
        const sinTheta = (radius1 - radius0) / tmpVec1.length();
        if (Math.abs(sinTheta) >= 1 / minScale * 0.9999) {
            tmpVec1.addVectors(center0, center1).multiplyScalar(0.5);
            for (let i = 0; i < facePositionsArray.length; i += 3) {
                facePositionsArray[i] = tmpVec1.x;
                facePositionsArray[i + 1] = tmpVec1.y;
                facePositionsArray[i + 2] = tmpVec1.z;
            }
            return toPositions();
        }
        else if (Math.abs(sinTheta) > 1)
            return this.computeOptimisedDownscalingBoundingCube(center0, minScale * radius0, center1, minScale * radius1, origin, 1);
        const cosTheta = Math.cos(Math.asin(sinTheta));
        const height = tmpVec1.length() + sinTheta * (radius0 - (minScale * minScale) * radius1);
        const unscaledHeight = tmpVec1.length() + sinTheta * (radius0 - radius1);
        tmpVec2.copy(center0).addScaledVector(tmpVec1.normalize(), -sinTheta * radius0);
        const r0 = radius0 * cosTheta;
        const r1 = radius1 * cosTheta;
        let s = r1 > 0 ? r0 / r1 : 1;
        for (let i = 0; i < 12; i += 3) {
            facePositionsArray[i] *= s;
            facePositionsArray[i + 2] *= s;
        }
        s = Math.cos(Math.asin(minScale * sinTheta)) * radius1 * minScale / r1;
        for (let i = 24; i < 36; i += 3) {
            facePositionsArray[i] *= s;
            facePositionsArray[i + 2] *= s;
        }
        const newY = 2 * unscaledHeight / height - 1;
        for (let i = 12; i < 24; i += 3)
            facePositionsArray[i + 1] = newY;
        const attribute = new BufferAttribute(toPositions(), 3);
        tmpMat.makeScale(r1, height / 2, r1);
        attribute.applyMatrix4(tmpMat);
        tmpVec.set(0, 1, 0);
        const angle = tmpVec.angleTo(tmpVec1);
        const dot = tmpVec.dot(tmpVec1);
        tmpVec.cross(tmpVec1).normalize();
        if (tmpVec.length() > 0) {
            tmpMat.makeRotationAxis(tmpVec, angle);
            attribute.applyMatrix4(tmpMat);
        }
        else if (dot < 0) {
            tmpMat.makeRotationZ(Math.PI);
            attribute.applyMatrix4(tmpMat);
        }
        if (origin != null) {
            tmpVec.copy(tmpVec2).addScaledVector(tmpVec1, height / 2).sub(origin);
            tmpMat.makeTranslation(tmpVec.x, tmpVec.y, tmpVec.z);
            attribute.applyMatrix4(tmpMat);
        }
        return attribute.array;
    }
    /**
     * @param frustum   {!ConeFrustum}
     * @returns {boolean}
     */
    equals(frustum) {
        return this.base.equals(frustum.base) &&
            this.axis.equals(frustum.axis) &&
            this.height === frustum.height &&
            this.radius0 === frustum.radius0 &&
            this.radius1 === frustum.radius1;
    }
}

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save view space normals in pixels inside rbg channels as well as Depth inside the alpha channel 
     * Use same parameters as for MeshNormalMaterial.
     * 
     *
     */
class MeshNormalDepthMaterial extends ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = UniformsUtils.merge([
            ShaderLib.normal.uniforms,
            { linearize_depth: { value: parameters.linearize_depth ?? true } }
        ]);
        parameters.vertexShader = 'varying mat4 vProjectionMatrix;' + '\n'
            + ShaderLib.normal.vertexShader.replace(
                '#include <uv_vertex>',
                'vProjectionMatrix = projectionMatrix;' + '\n'
                + '#include <uv_vertex>'
            );
        parameters.fragmentShader =
            'varying mat4 vProjectionMatrix;' + '\n' +
            'uniform bool linearize_depth;' + '\n' +
            ShaderLib.normal.fragmentShader.replace(
                'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
                'float zN = 2.0*gl_FragCoord.z - 1.0;' + '\n'
                + 'float p23 = vProjectionMatrix[3][2];' + '\n'
                + 'float k = (vProjectionMatrix[2][2] - 1.0f)/(vProjectionMatrix[2][2] + 1.0f);' + '\n'
                + 'float inK = vProjectionMatrix[2][2] / p23;' + '\n'
                + 'float zFar =  p23/(1.0f + p23*inK);' + '\n'
                + 'float zNear =  1.0f/(inK - 1.0/p23);' + '\n'
                + 'float linearizedDepth =  2.0 * zNear * zFar / (zFar  + zNear - zN * (zFar - zNear));' + '\n'
                + 'float depth_e = linearize_depth ? linearizedDepth : zN;' + '\n'
                + 'gl_FragColor = vec4( packNormalToRGB( normal ), depth_e );'
            );

        super(parameters);

        this.bumpMap = null;
        this.bumpScale = 1;

        this.normalMap = null;
        this.normalMapType = TangentSpaceNormalMap;
        this.normalScale = new Vector2(1, 1);

        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;

        this.wireframe = false;
        this.wireframeLinewidth = 1;

        this.fog = false;
        this.lights = false;

        this.skinning = false;
        this.morphTargets = false;
        this.morphNormals = false;

        this.isMeshNormalMaterial = true;
        this.isMeshNormalDepthMaterial = true;

    }
}

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 * Material packing depth as rgba values.
 * It is basically just MeshDepthMaterial with depthPacking at THREE.RGBADepthPacking
 */
class MeshRGBADepthMaterial extends MeshDepthMaterial {

    constructor(parameters) {

        parameters = parameters || {};
        parameters.depthPacking = RGBADepthPacking;
        super(parameters);

    }

}

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * @param {boolean} useFloatTexture If true, we consider floatTexture extension is activated and available.
     *                                  The resulting coordinates will be stored in RGB components.
     *                                  If false (default), the coordinate to store must be defined by parameters.coordinate
     *                                  and will be packed in RGBA.
     * @param {string} coordinate x, y or z to choose which coordinate will be packed in RGBA using THREE.JS packDepthToRGBA. Values will be mapped from -1:1 to 0:0.5 since
     *                            depth packing does only provide methods to store in [0,1[ To recover the view coordinate, you need to do
     *                            x = 4*unpackRGBAToDepth(rgba) - 1;
     */
class MeshViewPositionMaterial extends ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = UniformsUtils.merge([
            ShaderLib.displacementmap
        ]);
        parameters.vertexShader = [

            '#include <common>',
            '#include <displacementmap_pars_vertex>',
            '#include <fog_pars_vertex>',
            '#include <morphtarget_pars_vertex>',
            '#include <skinning_pars_vertex>',
            '#include <shadowmap_pars_vertex>',
            '#include <logdepthbuf_pars_vertex>',
            '#include <clipping_planes_pars_vertex>',

            'varying vec3 vViewPosition;',

            'void main() {',

            '#include <skinbase_vertex>',

            '#include <begin_vertex>',
            '#include <morphtarget_vertex>',
            '#include <skinning_vertex>',
            '#include <displacementmap_vertex>',
            '#include <project_vertex>',
            '#include <logdepthbuf_vertex>',
            '#include <clipping_planes_vertex>',

            'vViewPosition = (viewMatrix * modelMatrix * vec4( transformed, 1.0)).xyz;',

            '}'
        ].join('\n');

        parameters.fragmentShader = [
            'varying vec3 vViewPosition;',
            'void main() {',
            'gl_FragColor = vec4(vViewPosition.xyz,1.0);',
            '}',
        ].join('\n');

        super(parameters);

        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;

        this.wireframe = false;
        this.wireframeLinewidth = 1;

        this.fog = false;
        this.lights = false;

        this.skinning = false;
        this.morphTargets = false;

    }
}

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save world space normals in pixels, the way MeshNormalMaterial does for view space normals.
     * Use same parameters as for MeshNormalMaterial.
     *
     * You need to update the uniform viewMatrixInverse for this material to work properly.
     * If you don't want to do it by yourself, just call MeshWorldNormalMaterial.updateMeshOnBeforeRender on any mesh using this material.
     * see MeshWorldNormalMaterial.updateMeshOnBeforeRender for more details.
     */
class MeshWorldNormalMaterial extends ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = UniformsUtils.merge([
            ShaderLib.normal.uniforms,
            { viewMatrixInverse: { value: new Matrix4() } }
        ]);
        parameters.vertexShader = ShaderLib.normal.vertexShader;
        parameters.fragmentShader =
            'uniform mat4 viewMatrixInverse;' + '\n' +
            ShaderLib.normal.fragmentShader.replace(
                'gl_FragColor = ',

                'normal = normalize(mat3(viewMatrixInverse) * normal);' + '\n' +
                'gl_FragColor = '
            );

        super(parameters);

        this.bumpMap = null;
        this.bumpScale = 1;

        this.normalMap = null;
        this.normalMapType = TangentSpaceNormalMap;
        this.normalScale = new Vector2(1, 1);

        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;

        this.wireframe = false;
        this.wireframeLinewidth = 1;

        this.fog = false;
        this.lights = false;

        this.skinning = false;
        this.morphTargets = false;
        this.morphNormals = false;

        this.isMeshNormalMaterial = true;
        this.isMeshWorldNormalMaterial = true;

    }

    /**
     *  Helper to update the mesh onBeforeRender function to update the vewMatrixInverse uniform.
     *  Call it only once on each mesh or it may impact performances.
     *  Note that previously set onBeforeRender will be preserved.
     */
    updateMeshOnBeforeRender = function (mesh) {

        const oldOnBeforeRender = mesh.onBeforeRender;
        mesh.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {

            oldOnBeforeRender.call(this, renderer, scene, camera, geometry, material, group);

            if (this.material.isMeshWorldNormalMaterial)
                this.material.uniforms.viewMatrixInverse.value.copy(camera.matrixWorld);

        };
    }
}

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 *
 */
class MeshWorldPositionMaterial extends ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = UniformsUtils.merge([
            ShaderLib.depth.uniforms
        ]);
        parameters.vertexShader = [

            '#include <common>',
            '#include <displacementmap_pars_vertex>',
            '#include <fog_pars_vertex>',
            '#include <morphtarget_pars_vertex>',
            '#include <skinning_pars_vertex>',
            '#include <shadowmap_pars_vertex>',
            '#include <logdepthbuf_pars_vertex>',
            '#include <clipping_planes_pars_vertex>',

            'varying vec4 vWorldPosition;',

            'void main() {',

            '#include <skinbase_vertex>',

            '#include <begin_vertex>',
            '#include <morphtarget_vertex>',
            '#include <skinning_vertex>',
            '#include <displacementmap_vertex>',
            '#include <project_vertex>',
            '#include <logdepthbuf_vertex>',
            '#include <clipping_planes_vertex>',

            'vWorldPosition = modelMatrix * vec4( transformed, 1.0 );',

            '}'
        ].join('\n');

        parameters.fragmentShader = [
            'varying vec4 vWorldPosition;',
            'void main() {',
            'gl_FragColor = vWorldPosition;',
            '}',
        ].join('\n');

        super(parameters);

        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;

        this.wireframe = false;
        this.wireframeLinewidth = 1;

        this.fog = false;
        this.lights = false;

        this.skinning = false;
        this.morphTargets = false;

        this.isMeshDepthMaterial = true;
        this.isMeshWorldPositionMaterial = true;

    }

}

const _A = new Vector3();
const _B = new Vector3();
const _C = new Vector3();

class EdgeSplitModifier {

	modify( geometry, cutOffAngle, tryKeepNormals = true ) {

		function computeNormals() {

			normals = new Float32Array( indexes.length * 3 );

			for ( let i = 0; i < indexes.length; i += 3 ) {

				let index = indexes[ i ];

				_A.set(
					positions[ 3 * index ],
					positions[ 3 * index + 1 ],
					positions[ 3 * index + 2 ] );

				index = indexes[ i + 1 ];
				_B.set(
					positions[ 3 * index ],
					positions[ 3 * index + 1 ],
					positions[ 3 * index + 2 ] );

				index = indexes[ i + 2 ];
				_C.set(
					positions[ 3 * index ],
					positions[ 3 * index + 1 ],
					positions[ 3 * index + 2 ] );

				_C.sub( _B );
				_A.sub( _B );

				const normal = _C.cross( _A ).normalize();

				for ( let j = 0; j < 3; j ++ ) {

					normals[ 3 * ( i + j ) ] = normal.x;
					normals[ 3 * ( i + j ) + 1 ] = normal.y;
					normals[ 3 * ( i + j ) + 2 ] = normal.z;

				}

			}

		}


		function mapPositionsToIndexes() {

			pointToIndexMap = Array( positions.length / 3 );

			for ( let i = 0; i < indexes.length; i ++ ) {

				const index = indexes[ i ];

				if ( pointToIndexMap[ index ] == null ) {

					pointToIndexMap[ index ] = [];

				}

				pointToIndexMap[ index ].push( i );

			}

		}


		function edgeSplitToGroups( indexes, cutOff, firstIndex ) {

			_A.set( normals[ 3 * firstIndex ], normals[ 3 * firstIndex + 1 ], normals[ 3 * firstIndex + 2 ] ).normalize();

			const result = {
				splitGroup: [],
				currentGroup: [ firstIndex ]
			};

			for ( const j of indexes ) {

				if ( j !== firstIndex ) {

					_B.set( normals[ 3 * j ], normals[ 3 * j + 1 ], normals[ 3 * j + 2 ] ).normalize();

					if ( _B.dot( _A ) < cutOff ) {

						result.splitGroup.push( j );

					} else {

						result.currentGroup.push( j );

					}

				}

			}

			return result;

		}


		function edgeSplit( indexes, cutOff, original = null ) {

			if ( indexes.length === 0 ) return;

			const groupResults = [];

			for ( const index of indexes ) {

				groupResults.push( edgeSplitToGroups( indexes, cutOff, index ) );

			}

			let result = groupResults[ 0 ];

			for ( const groupResult of groupResults ) {

				if ( groupResult.currentGroup.length > result.currentGroup.length ) {

					result = groupResult;

				}

			}


			if ( original != null ) {

				splitIndexes.push( {
					original: original,
					indexes: result.currentGroup
				} );

			}

			if ( result.splitGroup.length ) {

				edgeSplit( result.splitGroup, cutOff, original || result.currentGroup[ 0 ] );

			}

		}

		if ( geometry.isGeometry === true ) {

			console.error( 'THREE.EdgeSplitModifier no longer supports THREE.Geometry. Use BufferGeometry instead.' );
			return;

		}

		let hadNormals = false;
		let oldNormals = null;

		if ( geometry.attributes.normal ) {

			hadNormals = true;

			geometry = geometry.clone();

			if ( tryKeepNormals === true && geometry.index !== null ) {

				oldNormals = geometry.attributes.normal.array;

			}

			geometry.deleteAttribute( 'normal' );

		}

		if ( geometry.index == null ) {

			if ( BufferGeometryUtils === undefined ) {

				throw 'THREE.EdgeSplitModifier relies on BufferGeometryUtils';

			}
			geometry = BufferGeometryUtils.mergeVertices( geometry );
		}

		const indexes = geometry.index.array;
		const positions = geometry.getAttribute( 'position' ).array;

		let normals;
		let pointToIndexMap;

		computeNormals();
		mapPositionsToIndexes();

		const splitIndexes = [];

		for ( const vertexIndexes of pointToIndexMap ) {

			edgeSplit( vertexIndexes, Math.cos( cutOffAngle ) - 0.001 );

		}

		const old_nb_indices = positions.length / 
			geometry.getAttribute( 'position' ).itemSize;
		const new_nb_indices = old_nb_indices + splitIndexes.length;
	
	
		const newAttributes = {};
		for ( const name of Object.keys( geometry.attributes ) ) {

			const oldAttribute = geometry.attributes[ name ];
			const newArray = new oldAttribute.array.constructor(new_nb_indices * oldAttribute.itemSize );
			newArray.set( oldAttribute.array );
			newAttributes[ name ] = new BufferAttribute( newArray, oldAttribute.itemSize, oldAttribute.normalized );

		}

		const newIndexes = new Uint32Array( indexes.length );
		newIndexes.set( indexes );
		for ( let i = 0; i < splitIndexes.length; i ++ ) {

			const split = splitIndexes[ i ];
			const index = indexes[ split.original ];

			for ( const attribute of Object.values( newAttributes ) ) {

				for ( let j = 0; j < attribute.itemSize; j ++ ) {

					attribute.array[ ( old_nb_indices  + i ) * attribute.itemSize + j ] =
						attribute.array[ index * attribute.itemSize + j ];

				}

			}

			for ( const j of split.indexes ) {

				newIndexes[ j ] = old_nb_indices+ i;

			}

		}

		geometry = new BufferGeometry();
		geometry.setIndex( new BufferAttribute( newIndexes, 1 ) );

		for ( const name of Object.keys( newAttributes ) ) {

			geometry.setAttribute( name, newAttributes[ name ] );

		}

		if ( hadNormals ) {

			geometry.computeVertexNormals();

			if ( oldNormals !== null ) {

				const changedNormals = new Array( oldNormals.length / 3 ).fill( false );

				for ( const splitData of splitIndexes )
					changedNormals[ splitData.original ] = true;

				for ( let i = 0; i < changedNormals.length; i ++ ) {

					if ( changedNormals[ i ] === false ) {

						for ( let j = 0; j < 3; j ++ )
							geometry.attributes.normal.array[ 3 * i + j ] = oldNormals[ 3 * i + j ];

					}

				}


			}

		}

		return geometry;

	}

}

export { ConeFrustum, EdgeSplitModifier, MeshNormalDepthMaterial, MeshRGBADepthMaterial, MeshViewPositionMaterial, MeshWorldNormalMaterial, MeshWorldPositionMaterial };
//# sourceMappingURL=three-js-extra-public.module.js.map
