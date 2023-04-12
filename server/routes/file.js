import express from 'express';
import {
    fileIdValidator,
    filesListValidator, fileUploadValidator
} from '../files/files.validator';
const router = express.Router();
import FilesController from '../files/files.controller';
import {verifyAccessToken} from '../auth/auth.middleware';
import fileUpload from 'express-fileupload';

router.get('/upload',
    (_, res) => res.sendFile('file-upload.html', { root: './public' }));

/* Upload file (without authentication checking (TODO: auth on frontend)). */
router.post('/upload',
    fileUpload({ createParentPath: true }),
    ...fileUploadValidator,
    FilesController.uploadFile);

/* Update file by param id. */
router.put('/update/:id',
    fileUpload({ createParentPath: true }),
    ...fileUploadValidator,
    ...fileIdValidator,
    verifyAccessToken,
    FilesController.updateFile);

/* Get users according to list_size & page */
router.get('/list', verifyAccessToken, ...filesListValidator, FilesController.getFilesList);

/* Remove file by param id. */
router.delete('/delete/:id', verifyAccessToken, ...fileIdValidator, FilesController.deleteFile);

/* Download file by param id. */
router.get('/download/:id', verifyAccessToken, ...fileIdValidator, FilesController.downloadFile);

/* Get file info by param id. */
router.get('/:id', verifyAccessToken, ...fileIdValidator, FilesController.getFileInfo);

export default router;
