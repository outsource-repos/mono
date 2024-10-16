import { $ } from "bun";

const REMOTE_USER = "ts";
const REMOTE_HOST = "192.168.1.141";
const REMOTE_PATH = "/home/ts/deploy/mono";
const HONO_PATH = `${REMOTE_PATH}/backend/hono`;
const IMAGE_NAME = "hono-app";
const CONTAINER_NAME = "hono-container";
const REPO_URL = "git@github.com:outsource-repos/mono.git";

async function deploy() {
  try {
    console.log("开始部署...");

    console.log("推送代码到远程仓库...");
    await $`git push origin main`;

    console.log("连接到远程服务器...");
    await $`ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "
      set -e
      mkdir -p ${REMOTE_PATH}
      cd ${REMOTE_PATH}
      if [ ! -d .git ]; then
        git clone ${REPO_URL} .
      else
        git fetch origin
        git reset --hard origin/main
      fi
      cd ${HONO_PATH}
      echo '=== 当前工作目录 ==='
      pwd
      echo '=== Dockerfile 路径 ==='
      ls -l Dockerfile || echo 'Dockerfile not found'
      echo '=== 目录内容 ==='
      ls -la
      echo '=== 父目录内容 ==='
      ls -la ..
      echo '=== 检查 Docker 配置 ==='
      docker info
      echo '=== 构建 Docker 镜像 ==='
      docker build --no-cache -t ${IMAGE_NAME} .
      echo '=== 运行 Docker 容器 ==='
      docker stop ${CONTAINER_NAME} || true
      docker rm ${CONTAINER_NAME} || true
      docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE_NAME}
    "`;

    console.log("部署完成！");
  } catch (error) {
    console.error("部署失败:", error);
    process.exit(1);
  }
}

deploy();
