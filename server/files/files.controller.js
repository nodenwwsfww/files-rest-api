import FilesService from './files.service';
import {getFileFromRequest} from './files.utils';
class FilesController {
    static async uploadFile (req, res){
        const file = getFileFromRequest(req);
        try {
            await FilesService.uploadOrUpdateFile(file);
            return res.status(200).json({ status: 'success', message: file.name })
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async getFilesList (req, res) {
        const pageSize = req.query.list_size || 10; // default page size is 10
        const page = req.query.page || 1; // default page number is 1
        try {
            const files = await FilesService.getFilesList(pageSize, page);
            return res.status(200).json({ files })
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async deleteFile (req, res) {
        const { id } = req.params;
        try {
            await FilesService.deleteFile(id);
            return res.status(200).json({ message: `File with id ${id} successfully deleted` });
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async getFileInfo (req, res) {
        const { id } = req.params;
        try {
            const file = await FilesService.getFileInfo(id);
            return res.status(200).json({ file });
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async downloadFile (req, res) {
        const { id } = req.params;
        try {
            const fileContent = await FilesService.downloadFile(id, res);

            // Send the file contents to the client
            return res.send(fileContent);
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
    static async updateFile (req, res) {
        const { id } = req.params;
        const file = getFileFromRequest(req);
        try {
            await FilesService.uploadOrUpdateFile(file, id);
            return res.status(200).json({ status: 'success', message: file.toString() })
        } catch (err) {
            return res.status(400).json({ errors: [err.message] });
        }
    }
}
export default FilesController;
