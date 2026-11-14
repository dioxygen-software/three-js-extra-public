import {
    GLSL3,
    ShaderLib,
    ShaderMaterial,
    TangentSpaceNormalMap,
    type ShaderMaterialParameters,
    UniformsUtils,
    Vector2,
    type Texture,
    type NormalMapTypes
} from 'three';

/**
 * G-buffer material for a multiple render targets pass with 3 color attachments (WebGL2 only). In a single draw it
 * writes what 2 passes of MeshViewPositionMaterial and MeshNormalDepthMaterial would write, plus the uv:
 *      - location 0: the view space position, as MeshViewPositionMaterial.
 *      - location 1: the packed view space normal and the NDC depth, as MeshNormalDepthMaterial with
 *        linearize_depth false.
 *      - location 2: the uv.
 * Built on three.js MeshNormalMaterial shaders, so it supports skinning, morphs, clipping planes, double sided
 * normals and normal, bump and displacement maps. Use same parameters as for MeshNormalMaterial.
 */
class MeshGBufferMaterial extends ShaderMaterial {

    bumpMap: Texture | null;
    bumpScale: number;
    normalMap: Texture | null;
    normalMapType: NormalMapTypes;
    normalScale: Vector2;
    displacementMap: Texture | null;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    isMeshNormalMaterial: boolean;
    isMeshGBufferMaterial: boolean;

    constructor(parameters: ShaderMaterialParameters = {}) {

        parameters.uniforms = UniformsUtils.merge([
            ShaderLib.normal.uniforms,
            // The G-buffer materials of three-js-shaders let these choose the space of each output, and pipelines
            // set them on every G-buffer material. They are accepted here, but the outputs are always in view space.
            {
                normal_space: { value: 2 },
                position_space: { value: 2 },
            },
        ]);
        parameters.glslVersion = GLSL3;
        parameters.vertexShader =
            'varying vec3 vGBufferPosition;' + '\n'
            + 'varying vec2 vGBufferUv;' + '\n'
            + ShaderLib.normal.vertexShader.replace(
                '#include <uv_vertex>',
                'vGBufferUv = uv;' + '\n'
                + '#include <uv_vertex>'
            ).replace(
                '#include <clipping_planes_vertex>',
                '#include <clipping_planes_vertex>' + '\n'
                + 'vGBufferPosition = (viewMatrix * modelMatrix * vec4( transformed, 1.0)).xyz;'
            );
        // GLSL3: three.js declares no gl_FragColor, the outputs are declared here.
        parameters.fragmentShader =
            'layout(location = 0) out highp vec4 gPosition;' + '\n'
            + 'layout(location = 1) out highp vec4 gNormalDepth;' + '\n'
            + 'layout(location = 2) out highp vec4 gUV;' + '\n'
            + 'varying vec3 vGBufferPosition;' + '\n'
            + 'varying vec2 vGBufferUv;' + '\n'
            + ShaderLib.normal.fragmentShader.replace(
                'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
                'gPosition = vec4(vGBufferPosition.xyz,1.0);' + '\n'
                + 'float zN = 2.0*gl_FragCoord.z - 1.0;' + '\n'
                + 'gNormalDepth = vec4( packNormalToRGB( normal ), zN );' + '\n'
                + 'gUV = vec4(vGBufferUv, 0.0, 1.0);'
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
        this.isMeshGBufferMaterial = true;

    }
}

export { MeshGBufferMaterial };
