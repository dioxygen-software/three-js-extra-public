import { MeshDepthMaterial, RGBADepthPacking, type MeshDepthMaterialParameters } from 'three'

/**
 * @author Maxime Quiblier / http://github.com/maximeq
 * Material packing depth as rgba values.
 * It is basically just MeshDepthMaterial with depthPacking at THREE.RGBADepthPacking
 */
class MeshRGBADepthMaterial extends MeshDepthMaterial {

    constructor(parameters: MeshDepthMaterialParameters) {

        parameters = parameters || {};
        parameters.depthPacking = RGBADepthPacking;
        super(parameters);

    }

}

export { MeshRGBADepthMaterial };