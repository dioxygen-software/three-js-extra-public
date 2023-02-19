import { ShaderLib, ShaderMaterial, UniformsUtils } from 'three';

var vertexShader = [
    "attribute vec3 barycentric;",

    "varying vec3 vTestNormal;",
    "varying vec3 vPosition;",
    "varying vec3 vBarycentric;",

    "void main()",
    "{",

    "   vec3 vNormal = normalize(normalMatrix * normal);",

    "   vPosition = position;",
    "   vTestNormal = normal;",
    "   vBarycentric = barycentric;",

    "   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
].join("\n");

var fragmentShader = [
    "uniform float opacity;",
    "uniform float lineWidth;",
    "uniform vec3 color;",
    "uniform vec3 lineColor;",

    "varying vec3 vTestNormal;",
    "varying vec3 vPosition;",
    "varying vec3 vBarycentric;",

    "#ifdef GL_OES_standard_derivatives",
    "   float edgeFactor(vec3 vBarycentric){                 ",
    "       vec3 d = lineWidth*fwidth(vBarycentric);                 ",
    "       vec3 a3 = smoothstep(vec3(0.0), d, vBarycentric);   ",
    "       return min(min(a3.x, a3.y), a3.z);             ",
    "   }",
    "#endif",

    "void main()",
    "{",
    "#ifdef GL_OES_standard_derivatives",
    "    gl_FragColor = mix(vec4(lineColor,1.0), vec4(color,opacity), edgeFactor(vBarycentric)); ",
    "#else",
    "   if(any(lessThan(vBarycentric, vec3(0.02)))){",
    "       gl_FragColor = vec4(lineColor,1.0);",
    "   }",
    "   else{",
    "       gl_FragColor = vec4(color,opacity);",
    "   }",
    "#endif",
    "}"
].join("\n");


class MeshWireframeMaterial extends ShaderMaterial {
    constructor(parameters) {
        super({
            uniforms: UniformsUtils.merge([
                ShaderLib.normal.uniforms,
                {
                    opacity: {
                        type: 'f',
                        value: parameters.opacity
                    },
                    lineWidth: {
                        type: 'f',
                        value: parameters.lineWidth
                    },
                    color: {
                        type: 'c',
                        value: parameters.color
                    },
                    lineColor: {
                        type: 'c',
                        value: parameters.lineColor
                    }
                }
            ]),
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        this.extensions.derivatives = true;
        this.opacity = parameters.opacity;
        this.transparent = parameters.opacity !== 1.0;
        this.side = parameters.side;
    }
}

export { MeshWireframeMaterial }
