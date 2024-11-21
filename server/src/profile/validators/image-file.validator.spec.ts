import { IsImageFileConstraint } from "./image-file.validator";
describe("ImageFileValidator", () => {
    describe("IsImageFileConstraint", () => {
        let isImageFileConstraint: IsImageFileConstraint;

        beforeEach(() => {
            isImageFileConstraint = new IsImageFileConstraint();
        });

        it("should be defined", () => {
            expect(isImageFileConstraint).toBeDefined();
        });

        describe("validator", () => {
            it("should return true if is an image file", () => {
                const mockFile = new File([], "Image", {
                    type: "image/png",
                });

                expect(isImageFileConstraint.validate(mockFile)).toBe(true);
            });

            it("should return false if not is an image file", () => {
                const mockFile = new File([], "Image", {
                    type: "plain/text",
                });

                expect(isImageFileConstraint.validate(mockFile)).toBe(false);
            });
        });
    });
});
