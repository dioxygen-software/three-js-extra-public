import { ShaderMaterial, type ShaderMaterialParameters, Vector2, type Texture, type NormalMapTypes } from 'three';
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
declare class MeshGBufferMaterial extends ShaderMaterial {
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
    constructor(parameters?: ShaderMaterialParameters);
}
export { MeshGBufferMaterial };
//# sourceMappingURL=MeshGBufferMaterial.d.ts.map