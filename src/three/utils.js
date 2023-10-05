import * as THREE from 'three';

const getGeometry = (object) => {
    const box = new THREE.Box3().setFromObject(object);
    const bounds = new THREE.Box3();
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    bounds.setFromObject(object);
    box.getCenter(center);
    box.getSize(size);

    return {
        boundingBox: bounds,
        center,
        size,
    }
}

const dumpGeometry = (string, object) => {
    const geometry = getGeometry(object);
    const scale = object.scale

    string = string || object?.name;

    console.log("--- " + string + " " + object.name + " ----------" );
    console.log(string + " - scale: " + JSON.stringify(scale));
    console.log(string + " - position: " + JSON.stringify(object.position));
    console.log(string + " - bounds: " + JSON.stringify(geometry.bounds));
    console.log(string + " - center: " + JSON.stringify(geometry.center));
    console.log(string + " - size: " + JSON.stringify(geometry.size));
};

export { dumpGeometry, getGeometry };