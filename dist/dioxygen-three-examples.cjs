'use strict';

var three = require('three');

/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save view space normals in pixels inside rbg channels as well as Depth inside the alpha channel 
     * Use same parameters as for MeshNormalMaterial.
     * 
     *
     */
class MeshNormalDepthMaterial extends three.ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = three.UniformsUtils.merge([
            three.ShaderLib.normal.uniforms,
            { linearize_depth: { value: parameters.linearize_depth ?? true } }
        ]);
        parameters.vertexShader = 'varying mat4 vProjectionMatrix;' + '\n'
            + three.ShaderLib.normal.vertexShader.replace(
                '#include <uv_vertex>',
                'vProjectionMatrix = projectionMatrix;' + '\n'
                + '#include <uv_vertex>'
            );
        parameters.fragmentShader =
            'varying mat4 vProjectionMatrix;' + '\n' +
            'uniform bool linearize_depth;' + '\n' +
            three.ShaderLib.normal.fragmentShader.replace(
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
        this.normalMapType = three.TangentSpaceNormalMap;
        this.normalScale = new three.Vector2(1, 1);

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
class MeshRGBADepthMaterial extends three.MeshDepthMaterial {

    constructor(parameters) {

        parameters = parameters || {};
        parameters.depthPacking = three.RGBADepthPacking;
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
class MeshViewPositionMaterial extends three.ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = three.UniformsUtils.merge([
            three.ShaderLib.displacementmap
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
class MeshWorldNormalMaterial extends three.ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = three.UniformsUtils.merge([
            three.ShaderLib.normal.uniforms,
            { viewMatrixInverse: { value: new three.Matrix4() } }
        ]);
        parameters.vertexShader = three.ShaderLib.normal.vertexShader;
        parameters.fragmentShader =
            'uniform mat4 viewMatrixInverse;' + '\n' +
            three.ShaderLib.normal.fragmentShader.replace(
                'gl_FragColor = ',

                'normal = normalize(mat3(viewMatrixInverse) * normal);' + '\n' +
                'gl_FragColor = '
            );

        super(parameters);

        this.bumpMap = null;
        this.bumpScale = 1;

        this.normalMap = null;
        this.normalMapType = three.TangentSpaceNormalMap;
        this.normalScale = new three.Vector2(1, 1);

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
class MeshWorldPositionMaterial extends three.ShaderMaterial {

    constructor(parameters) {

        parameters = parameters || {};

        parameters.uniforms = three.UniformsUtils.merge([
            three.ShaderLib.depth.uniforms
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

exports.MeshNormalDepthMaterial = MeshNormalDepthMaterial;
exports.MeshRGBADepthMaterial = MeshRGBADepthMaterial;
exports.MeshViewPositionMaterial = MeshViewPositionMaterial;
exports.MeshWorldNormalMaterial = MeshWorldNormalMaterial;
exports.MeshWorldPositionMaterial = MeshWorldPositionMaterial;
