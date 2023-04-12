import connection from '../database';
import mime from 'mime';
import {deleteFileLocallyIfExist, saveFileLocally} from './files.utils';
class FilesService {
    static async uploadOrUpdateFile(file, id) {
        const {name, data: content, size} = file;
        const extension = name.split('.')[1];

        const mimeType = mime.getType(name);

        const fileData = {
            name, content, extension, uploaded_to: new Date(), mime_type: mimeType, bytes_size: size
        };
        let fileId = id;
        // if we need to update an existing file
        if (id) {
            await connection.query('UPDATE files SET ? WHERE id = ?', [fileData, id]);
        } else {
            const result = await connection.query('INSERT INTO files SET ?', fileData);
            fileId = result.insertId;
        }

        const fileLocalName = `${fileId}_${file.name}`;
        // Update file locally
        await saveFileLocally({...file, name: fileLocalName});
    }

    static async getFilesList(pageSize, page) {
        const offset = (page - 1) * pageSize;

        const files = await connection.query(
            `SELECT * FROM files LIMIT ${pageSize} OFFSET ${offset}`
        );
        return files;
    }

    static async findById(id) {
        const rows = await connection.query(`SELECT * FROM files WHERE id = '${id}' LIMIT 1`);
        if (rows.length) {
            return rows[0];
        }
    }
    static async deleteFile (id) {
        // Check if the file exists
        const file = await this.findById(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }

        // Delete the file from the database and local storage
        await connection.query('DELETE FROM files WHERE id = ?', id);

        // Delete file locally
        const fileLocalName = `${id}_${file.name}`;
        await deleteFileLocallyIfExist({...file, name: fileLocalName});
    }

    static async getFileInfo (id) {
        const file = FilesService.findById(id);
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }
        return file;
    }

    static async downloadFile (id, res) {
        // Get the file contents from the database
        const rows = await connection.query('SELECT content FROM files WHERE id = ? LIMIT 1', [id]);

        if (rows.length > 0) {
            // Set the response headers to indicate that we are sending a file
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=' + rows[0].id + '.dat');
            return rows[0].content;
        } else {
            throw new Error(`File with id ${id} not found`);
        }
    }
}
export default FilesService;
