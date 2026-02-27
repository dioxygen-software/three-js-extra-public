import { IcosahedronGeometry } from "three"

/**
 * @author baptistewagner & lucassort
 */

export class IcosahedronSphereGeometry extends IcosahedronGeometry {
    constructor(radius: number, subdivisionsLevel: number) {
        super(radius, subdivisionsLevel);

        this.type = "IcosahedronSphereGeometry";

    }
}
