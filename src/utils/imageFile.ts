export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('File could not be converted to base64'));
    });

    reader.addEventListener('error', () => {
      reject(new Error('File could not be read'));
    });

    reader.readAsDataURL(file);
  });
}

export function extractFile(value: FormDataEntryValue | FileList | null): File | null {
  if (value instanceof FileList) {
    return value.item(0);
  }

  if (value instanceof File && value.size > 0) {
    return value;
  }

  return null;
}
