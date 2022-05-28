import * as THREE from "three";

export function makeEarthCloudTexture() {
    // create destination canvas
    const canvasResult = document.createElement("canvas")
    canvasResult.width = 1024;
    canvasResult.height = 512;


    const contextResult = canvasResult.getContext("2d")!;

    const texture = new THREE.Texture(canvasResult);
    Promise.all([
        new Promise<HTMLImageElement>(resolve => {
            const imageMap = new Image();
            imageMap.addEventListener("load", function () {
                resolve(imageMap);
            });
            imageMap.src = "/texture/earthcloudmap.jpg";
        }),
        new Promise<HTMLImageElement>(resolve => {
            const imageTrans = new Image();
            imageTrans.addEventListener("load", function () {
                resolve(imageTrans);
            });
            imageTrans.src = "/texture/earthcloudmaptrans.jpg";
        }),
    ]).then(([imageMap, imageTrans]) => {
        console.log(imageMap, imageTrans)
        const canvasMap = document.createElement("canvas");
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        const contextMap = canvasMap.getContext("2d")!;

        contextMap.drawImage(imageMap, 0, 0);
        const dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

        const canvasTrans = document.createElement("canvas")
        canvasTrans.width = imageTrans.width;
        canvasTrans.height = imageTrans.height;
        const contextTrans = canvasTrans.getContext("2d")!;

        contextTrans.drawImage(imageTrans, 0, 0);
        const dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
        // merge dataMap + dataTrans into dataResult
        const dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
        for (var y = 0, offset = 0, height = imageMap.height; y < height; y++) {
            for (var x = 0, width = imageMap.width; x < width; x++, offset += 4) {
                dataResult.data[offset + 0] = dataMap.data[offset + 0]
                dataResult.data[offset + 1] = dataMap.data[offset + 1]
                dataResult.data[offset + 2] = dataMap.data[offset + 2]
                dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0]
            }
        }
        // update texture with result
        contextResult.putImageData(dataResult, 0, 0);
        texture.needsUpdate = true;
    });

    return texture;
}
