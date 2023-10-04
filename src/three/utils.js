import * as THREE from 'three';

const dumpGeometry = (string, object) => {
    const box = new THREE.Box3().setFromObject(object);
    const boundingBox = new THREE.Box3();
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    const scale = object.scale

    string = string || object?.name;

    boundingBox.setFromObject(object);
    box.getCenter(center);
    box.getSize(size);

    console.log("--- " + string + " " + object.name + " ----------" );
    console.log(string + " - scale: " + JSON.stringify(scale));
    console.log(string + " - position: " + JSON.stringify(object.position));
    console.log(string + " - boundingBox: " + JSON.stringify(boundingBox));
    console.log(string + " - center: " + JSON.stringify(center));
    console.log(string + " - size: " + JSON.stringify(size));
};

export { dumpGeometry };