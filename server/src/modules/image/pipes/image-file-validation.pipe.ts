import {
    Injectable,
    NotAcceptableException,
    PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
    transform(multerFile: Express.Multer.File) {
        const notIsAImageFile =
            !multerFile.mimetype || !multerFile.mimetype.startsWith("image/");

        if (notIsAImageFile) {
            throw new NotAcceptableException("Please select a image file");
        }

        return multerFile;
    }
}
