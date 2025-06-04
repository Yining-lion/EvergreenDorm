type HandleImageChangeOptions = {
  maxSizeMB?: number;
  validTypes?: string[];
  onValid: (file: File, previewURL: string) => void;
  onInvalidType?: () => void;
  onInvalidSize?: () => void;
};

export const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    options: HandleImageChangeOptions
) => {
    const { maxSizeMB = 2, validTypes = ["image/jpeg", "image/png"], onValid, onInvalidType, onInvalidSize } = options;

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 檢查類型
    if (!validTypes.includes(selectedFile.type)) {
        onInvalidType?.();
        alert("只能上傳 JPEG 或 PNG 圖片格式");
        return;
    }

    // 檢查大小
    const isTooLarge = selectedFile.size > maxSizeMB * 1024 * 1024;
    if (isTooLarge) {
        onInvalidSize?.();
        alert(`圖片不能超過 ${maxSizeMB} MB`);
        return;
    }

    const previewURL = URL.createObjectURL(selectedFile);
    onValid(selectedFile, previewURL);
};
