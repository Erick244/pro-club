import {
    Injectable,
    NotAcceptableException,
    PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ImageFileSizeValidationPipe implements PipeTransform {
    transform(multerFile: Express.Multer.File) {
        const oneKb = 1024;
        const maxSize = oneKb * 5;

        if (multerFile.size > maxSize) {
            throw new NotAcceptableException(
                "The image file exceeds the 5Mb limit",
            );
        }

        return multerFile;
    }
}
