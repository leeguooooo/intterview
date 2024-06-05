import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export const downloadOfflinePackage = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Error downloading offline package:", error);
  }
};

export const loadOfflinePackage = async (filename) => {
  try {
    const contents = await Filesystem.readFile({
      path: filename,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    return contents;
  } catch (error) {
    console.error("Error loading offline package:", error);
    return null;
  }
};
