# three-js-sphere-geometries
3 different meshes for modelling spheres as new geometric primitives for THREE.JS.

The different meshes are the following (with their related Buffer Geometry):
* Rounded Cube (RoundedCubeBufferGeometry)
* Spherified Cube (SpherifiedCubeBufferGeometry)
* Icosahedron (IcosahedronSphereBufferGeometry)

The rounded cube is made by normalizing a cube.

The spherified cube is an improved version of the rounded cube.

For the icosahedron, we use the one from three.js (see https://threejs.org/docs/index.html#api/en/geometries/IcosahedronBufferGeometry).


## Setup
Assuming that npm and node are already installed.

Clone the current repository. Then in the repository folder :

```
npm install
```

This should install all required dependencies for build and development.

## Usage
You can use this library directly in browser or from node.js.

### Browser
Distribution files can be found in ./dist/browser, to be included in your HTML :

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>THREE CapsuleBufferGeometry</title>
    </head>
    <body>
        <!-- Don't forget to include THREE, its is not shipped with the lib -->
        <script src="three.js"></script>
        <script src="dist/browser/three-js-sphere-geometries.js"></script>
        <script>
            alert('Checking definition of RoundedCubeBufferGeometry : ' + THREE.RoundedCubeBufferGeometry !== undefined);
            alert('Checking definition of SpherifiedCubeBufferGeometry : ' + THREE.SpherifiedCubeBufferGeometry !== undefined);
            alert('Checking definition of IcosahedronSphereBufferGeometry : ' + THREE.IcosahedronSphereBufferGeometry !== undefined);
        </script>
    </body>
</html>
```

### Node
In the repository folder:

```
npm start
```

This should open a browser window with a test application on a local server.

http-server must be installed in order to run this command:

```
npm install --global http-server
```

## Repository Commands
### Build:

```
npm run build
```

Will update the browser build in dist.

## Dependencies
### Browser Dependencies
In browser, only THREE is required.