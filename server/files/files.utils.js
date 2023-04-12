import path from 'path';
import * as fs from 'fs';

export const getFileFromRequest = (req) => {
    const files = req.files;
    const fileName = Object.keys(files)[0];
    const file = files[fileName];
    return file;
};

export const saveFileLocally = async (file) => {
    const filepath = path.join(__dirname, 'files', file.name)
    return new Promise((resolve, reject) => {
        file.mv(filepath, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        })
    })
}

export const deleteFileLocallyIfExist = async (file) => {
    const filepath = path.join(__dirname, 'files', file.name)
    return new Promise((resolve) => {
        fs.access(filepath, (err) => {
            if (err) {
                // File is not exist locally, so we don't need to remove it
                return resolve();
            } else {
                fs.unlink(filepath, () => {
                    if (err) {
                        // Unexpected error
                        throw err;
                    } else {
                        return resolve();
                    }
                });
            }
        });
    });
}
