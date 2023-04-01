import { type MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

type RemoveUndefined<T> = T extends undefined ? never : T;
export type FileFilter = RemoveUndefined<MulterOptions['fileFilter']>;
export type FileFilterCallback = Parameters<FileFilter>[2];
export type FileFilterProducer<T extends any[]> = (...args: T) => FileFilter;

export function composeFilters(...filters: FileFilter[]): FileFilter {
    return (req, file, cb) => {
        const callback: FileFilterCallback = (err, acceptFile) => {
            acceptFile || cb(err, false);
        };

        filters.forEach((filter) => filter(req, file, callback));
        return cb(null, true);
    };
}

export * from './ensure-mimetype.file-filter';
