import { MeshDepthMaterial, type MeshDepthMaterialParameters } from 'three';
/**
 * @author Maxime Quiblier / http://github.com/maximeq
 * Material packing depth as rgba values.
 * It is basically just MeshDepthMaterial with depthPacking at THREE.RGBADepthPacking
 */
declare class MeshRGBADepthMaterial extends MeshDepthMaterial {
    constructor(parameters: MeshDepthMaterialParameters);
}
export { MeshRGBADepthMaterial };
//# sourceMappingURL=MeshRGBADepthMaterial.d.ts.map