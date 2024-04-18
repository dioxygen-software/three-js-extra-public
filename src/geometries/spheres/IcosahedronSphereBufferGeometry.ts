import { IcosahedronBufferGeometry } from "three"

/**
 * @author baptistewagner & lucassort
 */

export class IcosahedronSphereBufferGeometry extends IcosahedronBufferGeometry {
    constructor(radius, subdivisionsLevel) {
        super(radius, subdivisionsLevel);

        this.type = "IcosahedronSphereBufferGeometry";

        var scope = this;
    }
}
