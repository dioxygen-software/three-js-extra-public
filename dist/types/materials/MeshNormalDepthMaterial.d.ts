/**
     * @author Maxime Quiblier / http://github.com/maximeq
     *
     * This material will save view space normals in pixels inside rbg channels as well as Depth inside the alpha channel
     * Use same parameters as for MeshNormalMaterial.
     *
     *
     */
export class MeshNormalDepthMaterial extends ShaderMaterial {
    constructor(parameters: any);
    bumpMap: any;
    bumpScale: number;
    normalMap: any;
    normalMapType: 0;
    normalScale: Vector2;
    displacementMap: any;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    morphTargets: boolean;
    morphNormals: boolean;
    isMeshNormalMaterial: boolean;
    isMeshNormalDepthMaterial: boolean;
}
import { ShaderMaterial } from 'three';
import { Vector2 } from 'three';
//# sourceMappingURL=MeshNormalDepthMaterial.d.ts.map