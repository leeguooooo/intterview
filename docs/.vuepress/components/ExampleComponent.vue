<template>
  <div>
    <button @click="checkForUpdates">Check for Offline Package Updates</button>
    <button @click="loadPackage">Load Offline Package</button>
    <pre>{{ packageContents }}</pre>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  downloadOfflinePackage,
  loadOfflinePackage
} from "../../utils/offlinePackage"; // 确保路径正确

const packageContents = ref(null);

const checkForUpdates = async () => {
  const response = await fetch(
    "https://example.com/offline-package-version.json"
  );
  const data = await response.json();
  const latestVersion = data.version;
  const currentVersion = localStorage.getItem("offlinePackageVersion");

  if (latestVersion !== currentVersion) {
    await downloadPackage(latestVersion);
    localStorage.setItem("offlinePackageVersion", latestVersion);
  }
};

const downloadPackage = async (version) => {
  await downloadOfflinePackage(
    `https://example.com/offline-package-${version}.zip`,
    "offline-package.zip"
  );
};

const loadPackage = async () => {
  const contents = await loadOfflinePackage("offline-package.zip");
  packageContents.value = contents;
};
</script>

<style scoped>
/* 添加样式 */
</style>
