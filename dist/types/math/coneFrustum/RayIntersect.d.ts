import { Vector3 } from "three";
import { ConeFrustum } from "./ConeFrustum";
declare module "three" {
    interface Ray {
        intersectsConeFrustum(frustum: ConeFrustum, target: Vector3 | null): Vector3 | null;
    }
}
//# sourceMappingURL=RayIntersect.d.ts.map