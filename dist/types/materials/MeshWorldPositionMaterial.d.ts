import { ShaderMaterial, type Texture, type ShaderMaterialParameters } from 'three';
/**
 * @author Maxime Quiblier / http://github.com/maximeq
 *
 */
declare class MeshWorldPositionMaterial extends ShaderMaterial {
    displacementMap: Texture | null;
    displacementScale: number;
    displacementBias: number;
    skinning: boolean;
    isMeshDepthMaterial: boolean;
    isMeshWorldPositionMaterial: boolean;
    constructor(parameters: ShaderMaterialParameters);
}
export { MeshWorldPositionMaterial };
//# sourceMappingURL=MeshWorldPositionMaterial.d.ts.map