/**
 * Returns the URL of the thumbnail for the given hero image.
 */
function getHeroThumbnailUrl(hero: string, includeHost = false) {
  let filename = hero;
  // Strip off everything except the document URI of the hero image
  filename = filename.replace(/.*\//, '');
  // This is a thumbnail - use the same filename as the hero image
  // but with a `-thumb' suffix before the extension.
  filename = filename.replace(/\.[^.]+$/, '-thumb$&');

  if (includeHost) {
    return `https://blog-teamclerks-net-images.s3.amazonaws.com/${filename}`;
  }

  return filename;
}

/**
 * Takes a given image DataURL and converts it to a File suitable for file upload.
 */
async function convertUrlStringToFile(src: DataURL): Promise<File> {
  const blob = await (await fetch(src)).blob();
  return new File([blob], 'image', { type: blob.type });
}

/**
 * Takes a given image file and converts it to a DataURL.
 */
async function convertFileToDataUrl(file: File | Blob): Promise<DataURL> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Failed to read file as data URL');
      }
    };
    reader.onerror = () => {
      reject('Failed to read file as data URL');
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Draws the given image to a dynamic canvas element, resamples the image to be appropriately sized
 * for a thumbnail, converts that canvas to a dataUrl, and passes that string to the callback. The
 * purpose of this function is to try and strip metadata from the images user upload to our system.
 */
async function drawThumbnail(
  src: Blob,
  maxImageDimension: number,
): Promise<DataURL> {
  const dataUrl = await convertFileToDataUrl(src);

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return reject('Could not get context for canvas in `drawThumbnail`');
    }
    const image = new Image();
    image.onload = async function () {
      canvas.width = image.width;
      canvas.height = image.height;
      const oc = document.createElement('canvas');
      const octx = oc.getContext('2d');
      if (!oc) {
        return reject('Could not get inner canvas in `drawThumbnail`');
      }
      if (!octx) {
        return reject(
          'Could not get context for inner canvas in `drawThumbnail`',
        );
      }

      // Determines if the image is portrait or landscape and resizes the canvas to the maximum
      // desired dimension. This is to ensure that the aspect ratio of the original image is kept
      // when resizing.
      const isPortrait = image.height > image.width;
      if (isPortrait) {
        canvas.height = maxImageDimension;
        canvas.width = canvas.height * (image.width / image.height);
      } else {
        canvas.width = maxImageDimension;
        canvas.height = canvas.width * (image.height / image.width);
      }

      let cur = {
        width: Math.floor(image.width * 0.5),
        height: Math.floor(image.height * 0.5),
      };

      oc.width = cur.width;
      oc.height = cur.height;

      octx.drawImage(image, 0, 0, cur.width, cur.height);

      while (cur.width * 0.5 > image.width) {
        cur = {
          width: Math.floor(cur.width * 0.5),
          height: Math.floor(cur.height * 0.5),
        };
        octx.drawImage(
          oc,
          0,
          0,
          cur.width * 2,
          cur.height * 2,
          0,
          0,
          cur.width,
          cur.height,
        );
      }

      context.drawImage(
        oc,
        0,
        0,
        cur.width,
        cur.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const dataUri = canvas.toDataURL(src.type);
      resolve(dataUri);
    };
    image.src = dataUrl;
  });
}

export {
  convertUrlStringToFile,
  convertFileToDataUrl,
  drawThumbnail,
  getHeroThumbnailUrl,
};
