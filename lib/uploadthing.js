import { generateComponents } from "@uploadthing/react";

import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
    generateComponents(ourFileRouter);