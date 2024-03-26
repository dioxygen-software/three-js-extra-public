import { ShaderMaterial, UniformsUtils, ShaderLib, TangentSpaceNormalMap, Vector2, MeshDepthMaterial, RGBADepthPacking, Matrix4, Vector3, BufferAttribute, BufferGeometry } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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

export { EdgeSplitModifier, MeshNormalDepthMaterial, MeshRGBADepthMaterial, MeshViewPositionMaterial, MeshWorldNormalMaterial, MeshWorldPositionMaterial };
//# sourceMappingURL=three-js-extra-free.module.js.map
