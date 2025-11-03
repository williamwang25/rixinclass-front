"use strict";
const common_vendor = require("../common/vendor.js");
function useUpload(url, formData = {}, options = {}, directFilePath) {
  const loading = common_vendor.ref(false);
  const error = common_vendor.ref(false);
  const data = common_vendor.ref();
  const progress = common_vendor.ref(0);
  const {
    /** 最大可选择的图片数量 */
    count = 1,
    /** 所选的图片的尺寸 */
    sizeType = ["original", "compressed"],
    /** 选择图片的来源 */
    sourceType = ["album", "camera"],
    /** 文件大小限制（MB） */
    maxSize = 10,
    /** 进度回调 */
    onProgress,
    /** 成功回调 */
    onSuccess,
    /** 失败回调 */
    onError,
    /** 完成回调 */
    onComplete
  } = options;
  const checkFileSize = (size) => {
    const sizeInMB = size / 1024 / 1024;
    if (sizeInMB > maxSize) {
      common_vendor.index.showToast({
        title: `文件大小不能超过${maxSize}MB`,
        icon: "none"
      });
      return false;
    }
    return true;
  };
  const run = () => {
    if (directFilePath) {
      loading.value = true;
      progress.value = 0;
      uploadFile({
        url,
        tempFilePath: directFilePath,
        formData,
        data,
        error,
        loading,
        progress,
        onProgress,
        onSuccess,
        onError,
        onComplete
      });
      return;
    }
    common_vendor.index.chooseMedia({
      count,
      mediaType: ["image"],
      // 仅支持图片类型
      sourceType,
      success: (res) => {
        const file = res.tempFiles[0];
        if (!checkFileSize(file.size))
          return;
        loading.value = true;
        progress.value = 0;
        uploadFile({
          url,
          tempFilePath: file.tempFilePath,
          formData,
          data,
          error,
          loading,
          progress,
          onProgress,
          onSuccess,
          onError,
          onComplete
        });
      },
      fail: (err) => {
        console.error("选择媒体文件失败:", err);
        error.value = true;
        onError == null ? void 0 : onError(err);
      }
    });
  };
  return { loading, error, data, progress, run };
}
function uploadFile({
  url,
  tempFilePath,
  formData,
  data,
  error,
  loading,
  progress,
  onProgress,
  onSuccess,
  onError,
  onComplete
}) {
  try {
    const uploadTask = common_vendor.index.uploadFile({
      url,
      filePath: tempFilePath,
      name: "file",
      // 文件对应的 key
      formData,
      header: {
        // H5环境下不需要手动设置Content-Type，让浏览器自动处理multipart格式
        "Content-Type": "multipart/form-data"
      },
      // 确保文件名称合法
      success: (uploadFileRes) => {
        console.log("上传文件成功:", uploadFileRes);
        try {
          const { data: _data } = JSON.parse(uploadFileRes.data);
          data.value = _data;
          onSuccess == null ? void 0 : onSuccess(_data);
        } catch (err) {
          console.error("解析上传响应失败:", err);
          error.value = true;
          onError == null ? void 0 : onError(new Error("上传响应解析失败"));
        }
      },
      fail: (err) => {
        console.error("上传文件失败:", err);
        error.value = true;
        onError == null ? void 0 : onError(err);
      },
      complete: () => {
        loading.value = false;
        onComplete == null ? void 0 : onComplete();
      }
    });
    uploadTask.onProgressUpdate((res) => {
      progress.value = res.progress;
      onProgress == null ? void 0 : onProgress(res.progress);
    });
  } catch (err) {
    console.error("创建上传任务失败:", err);
    error.value = true;
    loading.value = false;
    onError == null ? void 0 : onError(new Error("创建上传任务失败"));
  }
}
exports.useUpload = useUpload;
