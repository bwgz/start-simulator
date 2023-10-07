import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { dumpGeometry, getGeometry } from "@/three/utils.js";

/*
 * https://www.swisstiming.com/fileadmin/Resources/Data/Datasheets/DOCM_AQ_OSB11_anTiSlip_0519.pdf
 * https://www.swisstiming.com/fileadmin/Resources/Instruction_Manuals/3454.504.02.pdf
 *
 * On a global scale, the average height of men is around 5 feet 9 inches (175 cm), 
 * while the average height of women is around 5 feet 4 inches (162 cm). 
 */


const specification = {
    title: "XBOT",
    url: "https://3dwarehouse.sketchup.com/model/8388c2569591f4ccbfefd139d92d2a51/OSB11-starting-block",
    id: "xbot",
};

const make = (manager) => {
        return new Promise((resolve, reject) => {
            const fbxLoader = new FBXLoader(manager);
            const url = import.meta.env.BASE_URL + 'models/swimmer/';

            fbxLoader.setPath(url);

            fbxLoader.load("swimmer-01.fbx", (result) => {
                try {
                    const model = result;
                    model.name = specification.id;
                    model.rotateZ(Math.PI / 2);
                    model.rotateX(Math.PI / 2);
                    //dumpGeometry("original swimmer", model);

                    model.scale.set(0.01, 0.01, 0.01)
                    //dumpGeometry("scaled swimmer", model);

                    model.userData = {
                        specification,
                        geometry: getGeometry(model)
                    };
        
                    resolve(model);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        });

};

const maker = {
    id: specification.id,
    specification,
    make,
};

export { maker };
