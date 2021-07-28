const path = require('path');
const uuid = require('uuid').v1;
const fs = require('fs');
const { promisify } = require('util');

const mkdirPromise = promisify(fs.mkdir);

module.exports = {
  photoDirBuilderT: async (fileName, itemId, itemType, fileDir) => {
    const pathWithoutStatic = path.join(itemType, itemId.toString(), fileDir);
    const photoDirectory = path.join(process.cwd(), 'static', pathWithoutStatic);

    const fileExtension = fileName.split('.').pop();
    const photoName = `${uuid()}.${fileExtension}`;
    const finalPath = path.join(photoDirectory, photoName);

    await mkdirPromise(photoDirectory, { recursive: true });

    return {
      finalPath,
      photoPath: path.join(pathWithoutStatic, photoName)
    };
  }
};
