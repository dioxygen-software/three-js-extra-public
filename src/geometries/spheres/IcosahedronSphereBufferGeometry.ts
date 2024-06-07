import { IcosahedronBufferGeometry } from "three"

/**
 * @author baptistewagner & lucassort
 */

export class IcosahedronSphereBufferGeometry extends IcosahedronBufferGeometry {
    constructor(radius: number, subdivisionsLevel: number) {
        super(radius, subdivisionsLevel);

        this.type = "IcosahedronSphereBufferGeometry";

    }
}
