import * as fs from 'node:fs'
import path from 'path'

export const handleListImages = () => {
    const outputsDir = path.join("../workspace", "outputs");
    const files = fs.readdirSync(outputsDir);

    const checkImage = (file) => /\.(png|jpg|jpeg|gif|webp)$/i.test(file);
    const imageFiles = files.filter((file) => checkImage(file));

    return imageFiles.map((file) => ({
      name: file,
      path: path.resolve(path.join(outputsDir, file)),
    }))
  }
